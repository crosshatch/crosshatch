import { Socket, Worker } from "@effect/platform"
import { Exit, Deferred, Layer, Record, Context, Stream, Effect, Schema as S, PubSub, Data, RcRef } from "effect"

import type { FieldsRecord } from "./_types.ts"
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
  readonly pubsubRc: RcRef.RcRef<PubSub.PubSub<FieldsRecord.TaggedMember.Type<EventDefinitions>>, ConnectionError>

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
      Effect.flatMap(({ pubsubRc }) => RcRef.get(pubsubRc)),
      Effect.map((pubsub) => Stream.fromPubSub(pubsub)),
      Stream.unwrapScoped,
    )

    return Object.assign(tag, {
      [TypeId]: TypeId,
      definition,
      schema: { call, success, failure, event, actor },
      events,
      f,
    })
  }

export const layerSocket = <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>({
  client,
  url,
  protocols,
}: {
  readonly client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>
  readonly url: string
  readonly protocols?: string | Array<string> | undefined
}): Layer.Layer<ClientSelf, never, Socket.WebSocketConstructor> =>
  Effect.gen(function* () {
    type D = MethodDefinitions[keyof MethodDefinitions]
    type Success = D["success"]["Type"]
    type Failure = D["failure"]["Type"]

    let write:
      | ((data: string | Uint8Array | Socket.CloseEvent) => Effect.Effect<void, Socket.SocketError>)
      | undefined = undefined
    let pending: Record<string, Deferred.Deferred<Success, Failure>> = {}
    let nextId = 0

    const pubsubRc = yield* RcRef.make({
      acquire: Effect.gen(function* () {
        const socket = yield* Socket.makeWebSocket(url, { protocols })
        write = yield* socket.writer
        const pubsub = yield* PubSub.unbounded<FieldsRecord.TaggedMember.Type<EventDefinitions>>()

        pending = {}
        nextId = 0

        yield* Effect.addFinalizer(() =>
          Effect.gen(function* () {
            write = undefined
            yield* Effect.forEach(Object.values(pending), (deferred) =>
              Deferred.done(deferred, Exit.fail(new ConnectionError())),
            )
            pending = {}
          }),
        )

        yield* socket
          .run(
            Effect.fnUntraced(function* (raw) {
              const message = yield* S.decodeUnknown(S.parseJson(client.schema.actor))(
                raw instanceof Uint8Array ? new TextDecoder().decode(raw) : raw,
              )
              if (message === 1) return
              switch (message._tag) {
                case "Event": {
                  yield* pubsub.publish(message.event)
                  break
                }
                case "Success": {
                  const deferred = pending[message.id]
                  if (deferred) {
                    delete pending[message.id]
                    yield* Deferred.done(deferred, Exit.succeed(message.value))
                  }
                  break
                }
                case "Failure": {
                  const deferred = pending[message.id]
                  if (deferred) {
                    delete pending[message.id]
                    yield* Deferred.done(deferred, Exit.fail(message.cause))
                  }
                  break
                }
              }
            }),
          )
          .pipe(Effect.ensuring(PubSub.shutdown(pubsub)), Effect.forkScoped)

        return pubsub
      }).pipe(Effect.mapError(() => new ConnectionError())),
    })

    const f: F<ClientSelf, MethodDefinitions> = (_tag) =>
      Effect.fnUntraced(function* (payload) {
        if (!write) return yield* new ConnectionError()
        const id = nextId++
        const deferred = yield* Deferred.make<Success, Failure>()
        pending[id] = deferred
        yield* S.encode(S.parseJson(client.schema.call))({
          _tag: "Call",
          id,
          payload: { _tag, ...payload },
        }).pipe(
          Effect.flatMap(write),
          Effect.catchAll(() => new ConnectionError()),
        )
        return yield* Deferred.await(deferred)
      })

    return { pubsubRc, f }
  }).pipe(Layer.scoped(client))

export const layerPlatform = <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>(
  client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>,
): Layer.Layer<ClientSelf, never, Worker.PlatformWorker | Worker.Spawner> =>
  Effect.gen(function* () {
    type D = MethodDefinitions[keyof MethodDefinitions]
    type Success = D["success"]["Type"]
    type Failure = D["failure"]["Type"]

    let send:
      | ((message: Protocol.CallMessage.Type<MethodDefinitions>) => Effect.Effect<void, ConnectionError>)
      | undefined = undefined
    let pending: Record<string, Deferred.Deferred<Success, Failure>> = {}
    let nextId = 0

    const pubsubRc = yield* RcRef.make({
      acquire: Effect.gen(function* () {
        const manager = yield* Worker.makeManager
        const worker = yield* manager.spawn<
          Protocol.CallMessage.Type<MethodDefinitions> | 0,
          Protocol.ActorMessage.Type<MethodDefinitions, EventDefinitions>,
          never
        >({})
        const pubsub = yield* PubSub.unbounded<FieldsRecord.TaggedMember.Type<EventDefinitions>>()

        pending = {}
        nextId = 0
        send = (message) => worker.executeEffect(message).pipe(Effect.catchAll(() => new ConnectionError()))

        yield* Effect.addFinalizer(() =>
          Effect.gen(function* () {
            send = undefined
            yield* Effect.forEach(Object.values(pending), (deferred) =>
              Deferred.done(deferred, Exit.fail(new ConnectionError())),
            )
            pending = {}
          }),
        )

        yield* worker.execute(0).pipe(
          Stream.takeWhile((v) => v !== 1),
          Stream.runForEach(
            Effect.fnUntraced(function* (message) {
              switch (message._tag) {
                case "Event": {
                  yield* pubsub.publish(message.event)
                  break
                }
                case "Success": {
                  const deferred = pending[message.id]
                  if (deferred) {
                    delete pending[message.id]
                    yield* Deferred.done(deferred, Exit.succeed(message.value))
                  }
                  break
                }
                case "Failure": {
                  const deferred = pending[message.id]
                  if (deferred) {
                    delete pending[message.id]
                    yield* Deferred.done(deferred, Exit.fail(message.cause))
                  }
                  break
                }
              }
            }),
          ),
          Effect.ensuring(PubSub.shutdown(pubsub)),
          Effect.forkScoped,
        )

        return pubsub
      }).pipe(Effect.mapError(() => new ConnectionError())),
    })

    const f: F<ClientSelf, MethodDefinitions> = (_tag) =>
      Effect.fnUntraced(function* (payload) {
        if (!send) return yield* new ConnectionError()
        const id = nextId++
        const deferred = yield* Deferred.make<Success, Failure>()
        pending[id] = deferred
        yield* send({
          _tag: "Call",
          id,
          payload: { _tag, ...payload },
        })
        return yield* Deferred.await(deferred)
      })

    return { pubsubRc, f }
  }).pipe(Layer.scoped(client))
