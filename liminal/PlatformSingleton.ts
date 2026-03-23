import { WorkerRunner } from "@effect/platform"
import { Stream, Layer, Scope, Effect, Schema as S, PubSub, Ref, ExecutionStrategy, Exit, ParseResult } from "effect"

import type { FieldsRecord } from "./_type_util.ts"

import * as Actor from "./Actor.ts"
import * as ClientHandle from "./ClientHandle.ts"
import * as Method from "./Method.ts"

export const make = Effect.fnUntraced(function* <
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends S.Struct.Fields,
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, Method.MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
  Handlers extends Method.Handlers<MethodDefinitions, any>,
>({
  actor,
  name,
  attachments,
  handlers,
}: {
  readonly actor: Actor.Actor<
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ClientSelf,
    ClientId,
    MethodDefinitions,
    EventDefinitions
  >
  readonly name: NameA
  readonly attachments: S.Struct<AttachmentFields>["Type"]
  readonly handlers: Handlers
}) {
  const semaphore = yield* Effect.makeSemaphore(1)
  const task = semaphore.withPermits(1)
  const { call, actor: actorMessage } = actor.definition.client.schema
  const handles = new Set<ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>>()

  return Effect.gen(function* () {
    const scope = yield* Scope.fork(yield* Scope.Scope, ExecutionStrategy.sequential)
    const disconnect = Effect.gen(function* () {
      yield* Scope.close(scope, Exit.void)
      handles.delete(handle)
    })
    const attachmentsRef = yield* Ref.make(attachments)
    const listener = yield* PubSub.unbounded<typeof actorMessage.Type>()
    const handle = ClientHandle.make<ActorSelf, AttachmentFields, EventDefinitions>({
      send: (_tag, payload) =>
        listener
          .publish({
            _tag: "Event",
            event: {
              _tag,
              ...payload,
            },
          })
          .pipe(Effect.asVoid),
      attachments: Ref.get(attachmentsRef),
      save: (attachments) => Ref.set(attachmentsRef, attachments),
      disconnect,
    })
    handles.add(handle)
    yield* WorkerRunner.make<
      0 | typeof call.Type,
      ParseResult.ParseError,
      Exclude<Effect.Effect.Context<ReturnType<Handlers[keyof Handlers]>>, ActorSelf>,
      typeof actorMessage.Type | void
    >((raw: unknown) => {
      if (raw === 0) {
        return Stream.fromPubSub(listener)
      }
      return Effect.gen(function* () {
        const { id, payload } = yield* S.decodeUnknown(call)(raw)
        const handler = handlers[payload._tag]
        yield* handler(payload).pipe(
          Effect.matchEffect({
            onSuccess: (value) => listener.offer({ _tag: "Success" as const, id, value }),
            onFailure: (cause) => listener.offer({ _tag: "Failure" as const, id, cause }),
          }),
        )
      }).pipe(
        task,
        Effect.provide(
          Layer.succeed(actor, {
            name,
            handles,
            sender: handle,
          }),
        ),
      )
    })
  })
})
