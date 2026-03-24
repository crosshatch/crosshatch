import { Socket, Worker, WorkerError } from "@effect/platform"
import { Exit, Deferred, Layer, Record, Context, Stream, Effect, Schema as S, PubSub, Data } from "effect"

import type { FieldsRecord } from "./_type_util.ts"
import type { MethodDefinition } from "./Method.ts"

import * as Protocol from "./Protocol.ts"

export const TypeId = "~liminal/Client" as const

export interface ClientDefinition<
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> {
  readonly methods: MethodDefinitions

  readonly events: EventDefinitions
}

export interface Service<
  ClientSelf,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> {
  readonly eventsPubsub: PubSub.PubSub<FieldsRecord.TaggedMember.Type<EventDefinitions>>

  readonly f: F<ClientSelf, MethodDefinitions>
}

export class ConnectionError extends Data.TaggedError("ConnectionError")<{}> {}

export type F<ClientSelf, MethodDefinitions extends Record<string, MethodDefinition.Any>> = <
  Method extends keyof MethodDefinitions,
>(
  method: Method,
) => (
  payload: S.Struct<MethodDefinitions[Method]["payload"]>["Type"],
) => Effect.Effect<
  MethodDefinitions[Method]["success"]["Type"],
  MethodDefinitions[Method]["failure"]["Type"] | ConnectionError,
  ClientSelf
>

export interface Client<
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> extends Context.Tag<ClientSelf, Service<ClientSelf, MethodDefinitions, EventDefinitions>> {
  new (_: never): Context.TagClassShape<ClientId, Service<ClientSelf, MethodDefinitions, EventDefinitions>>

  readonly [TypeId]: typeof TypeId

  readonly definition: ClientDefinition<MethodDefinitions, EventDefinitions>

  readonly schema: {
    readonly call: S.Schema<
      Protocol.CallMessage.Type<MethodDefinitions>,
      Protocol.CallMessage.Encoded<MethodDefinitions>
    >

    readonly client: S.Schema<
      Protocol.ClientMessage.Type<MethodDefinitions>,
      Protocol.ClientMessage.Encoded<MethodDefinitions>
    >

    readonly success: S.Schema<
      Protocol.SuccessMessage.Type<MethodDefinitions>,
      Protocol.SuccessMessage.Encoded<MethodDefinitions>
    >

    readonly failure: S.Schema<
      Protocol.FailureMessage.Type<MethodDefinitions>,
      Protocol.FailureMessage.Encoded<MethodDefinitions>
    >

    readonly event: S.Schema<
      Protocol.EventMessage.Type<EventDefinitions>,
      Protocol.EventMessage.Encoded<EventDefinitions>
    >

    readonly actor: S.Schema<
      Protocol.ActorMessage.Type<MethodDefinitions, EventDefinitions>,
      Protocol.ActorMessage.Encoded<MethodDefinitions, EventDefinitions>
    >
  }

  readonly events: Stream.Stream<FieldsRecord.TaggedMember.Type<EventDefinitions>, ConnectionError, ClientSelf>

  readonly f: F<ClientSelf, MethodDefinitions>
}

export const Service =
  <ClientSelf>() =>
  <
    ClientId extends string,
    MethodDefinitions extends Record<string, MethodDefinition.Any>,
    EventDefinitions extends FieldsRecord,
  >(
    id: ClientId,
    definition: ClientDefinition<MethodDefinitions, EventDefinitions>,
  ): Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions> => {
    const tag = Context.Tag(id)<ClientSelf, Service<ClientSelf, MethodDefinitions, EventDefinitions>>()

    const call: S.Schema<
      Protocol.CallMessage.Type<MethodDefinitions>,
      Protocol.CallMessage.Encoded<MethodDefinitions>
    > = S.TaggedStruct("Call", {
      id: S.Int,
      payload: S.Union(
        ...Object.entries(definition.methods).map(([_tag, { payload }]) => S.TaggedStruct(_tag, payload)),
      ),
    }) as never

    const client: S.Schema<
      Protocol.ClientMessage.Type<MethodDefinitions>,
      Protocol.ClientMessage.Encoded<MethodDefinitions>
    > = S.Union(call, S.Literal(0))

    const success: S.Schema<
      Protocol.SuccessMessage.Type<MethodDefinitions>,
      Protocol.SuccessMessage.Encoded<MethodDefinitions>
    > = S.TaggedStruct("Success", {
      id: S.Int,
      value: S.Union(...Object.values(definition.methods).map(({ success }) => success)),
    })

    const failure: S.Schema<
      Protocol.FailureMessage.Type<MethodDefinitions>,
      Protocol.FailureMessage.Encoded<MethodDefinitions>
    > = S.TaggedStruct("Failure", {
      id: S.Int,
      cause: S.Union(...Object.values(definition.methods).map(({ failure }) => failure)),
    })

    const event: S.Schema<
      Protocol.EventMessage.Type<EventDefinitions>,
      Protocol.EventMessage.Encoded<EventDefinitions>
    > = S.TaggedStruct("Event", {
      event: S.Union(...Object.entries(definition.events).map(([_tag, fields]) => S.TaggedStruct(_tag, fields))),
    }) as never

    const actor = S.Union(success, failure, event, S.Literal(1))

    const f: F<ClientSelf, MethodDefinitions> = (method) =>
      Effect.fnUntraced(function* (payload) {
        const { f } = yield* tag
        return yield* f(method)(payload)
      })

    const events = tag.pipe(
      Effect.map(({ eventsPubsub }) => Stream.fromPubSub(eventsPubsub)),
      Stream.unwrap,
    )

    return Object.assign(tag, {
      [TypeId]: TypeId,
      definition,
      schema: { call, client, success, failure, event, actor },
      events,
      f,
    })
  }

const listen = Effect.fnUntraced(function* <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>({
  messages,
  send,
}: {
  readonly client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>
  readonly messages: Stream.Stream<Protocol.ActorMessage.Type<MethodDefinitions, EventDefinitions>, ConnectionError>
  readonly send: (message: Protocol.ClientMessage.Type<MethodDefinitions>) => Effect.Effect<void, ConnectionError>
}) {
  const eventsPubsub = yield* PubSub.unbounded<FieldsRecord.TaggedMember.Type<EventDefinitions>>()
  let i = 0

  type D = MethodDefinitions[keyof MethodDefinitions]
  type Success = D["success"]["Type"]
  type Failure = D["failure"]["Type"]

  const pending: Record<string, Deferred.Deferred<Success, Failure>> = {}
  yield* messages.pipe(
    Stream.takeWhile((v) => v !== 1),
    Stream.runForEach(
      Effect.fnUntraced(function* (message) {
        switch (message._tag) {
          case "Event": {
            yield* eventsPubsub.publish(message.event)
            break
          }
          case "Success": {
            const { id, value } = message
            const deferred = yield* Effect.fromNullable(pending[id])
            delete pending[id]
            yield* Deferred.done(deferred, Exit.succeed(value))
            break
          }
          case "Failure": {
            const { id, cause } = message
            const deferred = yield* Effect.fromNullable(pending[id])
            delete pending[id]
            yield* Deferred.done(deferred, Exit.fail(cause))
            break
          }
        }
      }),
    ),
    Effect.ensuring(
      Effect.forEach(Object.values(pending), (deferred) => Deferred.done(deferred, Exit.fail(new ConnectionError()))),
    ),
    Effect.forkScoped,
  )
  yield* send(0)
  const f: F<ClientSelf, MethodDefinitions> = (_tag) =>
    Effect.fnUntraced(function* (payload) {
      const id = i++
      const deferred = yield* Deferred.make<Success, Failure>()
      pending[id] = deferred
      yield* send({
        _tag: "Call",
        id,
        payload: { _tag, ...payload },
      })
      return yield* Deferred.await(deferred)
    })

  return { f, eventsPubsub }
})

export const layerSocket = <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>({
  client,
  baseUrl,
  protocols,
}: {
  readonly client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>
  readonly baseUrl: string
  readonly protocols?: string | Array<string> | undefined
}): Layer.Layer<ClientSelf, ConnectionError, Socket.WebSocketConstructor> =>
  Effect.gen(function* () {
    const socket = yield* Socket.makeWebSocket(baseUrl, { protocols })
    const write = yield* socket.writer
    const messages = Stream.asyncEffect<
      Protocol.ActorMessage.Type<MethodDefinitions, EventDefinitions>,
      ConnectionError
    >(
      Effect.fnUntraced(
        function* (emit) {
          yield* socket.run(
            Effect.fnUntraced(function* (raw) {
              const message = yield* S.decodeUnknown(S.parseJson(client.schema.actor))(
                raw instanceof Uint8Array ? new TextDecoder().decode(raw) : raw,
              )
              yield* Effect.tryPromise(() => emit.single(message))
            }),
          )
        },
        Effect.mapError(() => new ConnectionError()),
      ),
    )
    return yield* listen({
      client,
      messages,
      send: (message) =>
        S.encode(S.parseJson(client.schema.client))(message).pipe(
          Effect.flatMap(write),
          Effect.catchAll(() => new ConnectionError()),
        ),
    })
  }).pipe(Layer.scoped(client))

export const layerPlatform = <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>(
  client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>,
): Layer.Layer<ClientSelf, WorkerError.WorkerError | ConnectionError, Worker.PlatformWorker | Worker.Spawner> =>
  Effect.gen(function* () {
    const manager = yield* Worker.makeManager
    const worker = yield* manager.spawn<
      Protocol.ClientMessage.Type<MethodDefinitions>,
      Protocol.ActorMessage.Type<MethodDefinitions, EventDefinitions>,
      never
    >({})
    return yield* listen({
      client,
      messages: worker.execute(0).pipe(Stream.mapError(() => new ConnectionError())),
      send: (message) => worker.executeEffect(message).pipe(Effect.catchAll(() => new ConnectionError())),
    })
  }).pipe(Layer.scoped(client))
