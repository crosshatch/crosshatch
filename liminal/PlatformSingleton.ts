import { WorkerRunner } from "@effect/platform"
import { Layer, Scope, Effect, Schema as S, PubSub, Ref, ExecutionStrategy, Exit, ParseResult } from "effect"

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
  const { schema } = actor.definition.client
  const handles = new Set<ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>>()
  const semaphore = yield* Effect.makeSemaphore(1)
  const task = semaphore.withPermits(1)

  return Effect.gen(function* () {
    const outerScope = yield* Scope.Scope
    const scope = yield* Scope.fork(outerScope, ExecutionStrategy.sequential)
    const disconnect = Effect.gen(function* () {
      yield* Scope.close(scope, Exit.void)
      handles.delete(handle)
    })
    const attachmentsRef = yield* Ref.make(attachments)
    const pubsub = yield* PubSub.unbounded<typeof schema.actor.Type>().pipe(Effect.acquireRelease(PubSub.shutdown))
    const handle = ClientHandle.make<ActorSelf, AttachmentFields, EventDefinitions>({
      send: (_tag, payload) =>
        pubsub
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
      unknown,
      ParseResult.ParseError,
      Exclude<Effect.Effect.Context<ReturnType<Handlers[keyof Handlers]>>, ActorSelf>,
      typeof schema.actor.Type | void
    >(
      Effect.fn(
        function* (raw) {
          const { id, payload } = yield* S.validate(schema.call)(raw)
          const handler = handlers[payload._tag]
          yield* handler(payload).pipe(
            Effect.matchEffect({
              onSuccess: (value) => pubsub.offer({ _tag: "Success" as const, id, value }),
              onFailure: (cause) => pubsub.offer({ _tag: "Failure" as const, id, cause }),
            }),
          )
        },
        task,
        Effect.provide(
          Layer.succeed(actor, {
            name,
            handles,
            currentHandle: handle,
          }),
        ),
      ),
    )
  })
})
