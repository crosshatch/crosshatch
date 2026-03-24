import { WorkerRunner } from "@effect/platform"
import { Layer, Scope, Effect, Schema as S, PubSub, Ref, ExecutionStrategy, Exit, ParseResult, Stream } from "effect"

import type { FieldsRecord, Fields } from "./_types.ts"

import * as Actor from "./Actor.ts"
import * as ClientHandle from "./ClientHandle.ts"
import * as Method from "./Method.ts"

export const make = Effect.fnUntraced(function* <
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
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
  const outer = yield* Scope.make()

  return Effect.gen(function* () {
    const inner = yield* Scope.fork(outer, ExecutionStrategy.sequential)
    const attachmentsRef = yield* Ref.make(attachments)
    const pubsub = yield* PubSub.unbounded<typeof schema.actor.Type>().pipe(
      Effect.acquireRelease(PubSub.shutdown),
      Scope.extend(inner),
    )
    const handle = ClientHandle.make<ActorSelf, AttachmentFields, EventDefinitions>({
      send: (_tag, payload) =>
        pubsub
          .publish({
            _tag: "Event",
            event: { _tag, ...payload },
          })
          .pipe(Effect.asVoid),
      attachments: Ref.get(attachmentsRef),
      save: (attachments) => Ref.set(attachmentsRef, attachments),
      disconnect: Effect.gen(function* () {
        yield* Scope.close(inner, Exit.void)
        handles.delete(handle)
      }),
    })
    handles.add(handle)
    yield* WorkerRunner.make<
      unknown,
      ParseResult.ParseError,
      Exclude<Effect.Effect.Context<ReturnType<Handlers[keyof Handlers]>>, ActorSelf>,
      typeof schema.actor.Type | void
    >((raw) => {
      if (raw === 0) {
        return Stream.fromPubSub(pubsub)
      }
      return Effect.gen(function* () {
        const message = yield* S.validate(schema.call)(raw)
        const { id, payload } = message
        const handler = handlers[payload._tag]
        yield* handler(payload).pipe(
          Effect.matchEffect({
            onSuccess: (value) => pubsub.offer({ _tag: "Success" as const, id, value }),
            onFailure: (cause) => pubsub.offer({ _tag: "Failure" as const, id, cause }),
          }),
        )
      }).pipe(
        task,
        Effect.provide(
          Layer.succeed(actor, {
            name,
            clients: handles,
            currentClient: handle,
          }),
        ),
        Scope.extend(inner),
      )
    })
  })
})
