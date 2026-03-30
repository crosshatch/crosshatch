import { Socket, Worker } from "@effect/platform"
import { Encoding, Deferred, Layer, Record, Context, Stream, Effect, Schema as S, PubSub, Queue, RcRef } from "effect"

import type { FieldsRecord } from "./_types.ts"
import type { F } from "./F.ts"
import type { MethodDefinition } from "./Method.ts"

import { type ClientError, AuditionError, ClosedBeforeResolvedError, ConnectionError } from "./errors.ts"
import * as Protocol from "./Protocol.ts"

export const TypeId = "~liminal/Client" as const

export interface ClientDefinition<
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> {
  readonly methods: MethodDefinitions

  readonly events: EventDefinitions
}

export type Service<
  ClientSelf,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
> = RcRef.RcRef<
  {
    readonly pubsub: PubSub.PubSub<FieldsRecord.TaggedMember.Type<EventDefinitions>>

    readonly replay: Queue.Dequeue<FieldsRecord.TaggedMember.Type<EventDefinitions>>

    readonly f: F<ClientSelf, MethodDefinitions>
  },
  ClientError
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

  readonly events: Stream.Stream<FieldsRecord.TaggedMember.Type<EventDefinitions>, ClientError, ClientSelf>

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
      value: S.Union(
        ...Record.toEntries(definition.methods).map(([_tag, { success: value }]) => S.TaggedStruct(_tag, { value })),
      ),
    }) as never

    const failure: S.Schema<
      Protocol.FailureMessage.Type<MethodDefinitions>,
      Protocol.FailureMessage.Encoded<MethodDefinitions>
    > = S.TaggedStruct("Failure", {
      id: S.Int,
      cause: S.Union(
        ...Record.toEntries(definition.methods).map(([_tag, { failure: value }]) => S.TaggedStruct(_tag, { value })),
      ),
    }) as never

    const event: S.Schema<
      Protocol.EventMessage.Type<EventDefinitions>,
      Protocol.EventMessage.Encoded<EventDefinitions>
    > = S.TaggedStruct("Event", {
      event: S.Union(...Object.entries(definition.events).map(([_tag, fields]) => S.TaggedStruct(_tag, fields))),
    }) as never

    const actor = S.Union(success, failure, event)

    const f: F<ClientSelf, MethodDefinitions> = (method) =>
      Effect.fnUntraced(function* (payload) {
        const rc = yield* tag
        return yield* Effect.scoped(
          Effect.gen(function* () {
            const { f } = yield* RcRef.get(rc)
            return yield* f(method)(payload)
          }),
        )
      })

    const events = Effect.gen(function* () {
      const rc = yield* tag
      const { pubsub, replay } = yield* RcRef.get(rc)
      const queue = yield* PubSub.subscribe(pubsub)
      const initial = yield* Queue.takeAll(replay)
      yield* Queue.shutdown(replay)
      return Stream.fromChunk(initial).pipe(Stream.concat(Stream.fromQueue(queue)))
    }).pipe(Stream.unwrapScoped)

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

    let nextId = 0
    const pending: Record<string, Deferred.Deferred<Success, Failure>> = {}
    const pubsub = yield* PubSub.unbounded<FieldsRecord.TaggedMember.Type<EventDefinitions>>()
    const replay = yield* PubSub.subscribe(pubsub)
    const closed = yield* Deferred.make<never, ClosedBeforeResolvedError>()

    const socket = yield* Socket.makeWebSocket(url, {
      protocols: [
        "liminal",
        Encoding.encodeBase64Url(client.key),
        ...(protocols ? (Array.isArray(protocols) ? protocols : [protocols]) : []),
      ],
    })

    const write = yield* socket.writer

    yield* socket
      .runRaw(
        Effect.fnUntraced(function* (raw) {
          const message = yield* S.decodeUnknown(S.parseJson(client.schema.actor))(
            raw instanceof Uint8Array ? new TextDecoder().decode(raw) : raw,
          )
          switch (message._tag) {
            case "Event": {
              yield* pubsub.publish(message.event)
              break
            }
            case "Success": {
              const deferred = pending[message.id]
              if (deferred) {
                delete pending[message.id]
                yield* Deferred.succeed(deferred, message.value.value)
              }
              break
            }
            case "Failure": {
              const deferred = pending[message.id]
              if (deferred) {
                delete pending[message.id]
                yield* Deferred.fail(deferred, message.cause.value)
              }
              break
            }
          }
        }),
      )
      .pipe(
        Effect.catchTag(
          "SocketError",
          Effect.fnUntraced(function* (cause) {
            const { code, message } = yield* S.decodeUnknown(
              S.Struct({
                code: S.Int.pipe(S.optional),
                message: S.String,
              }),
            )(cause)
            console.log({ code, message })
            switch (code) {
              case 4003: {
                return yield* yield* S.decodeUnknown(S.parseJson(Protocol.AuditionFailure))(message)
              }
              case 1000: {
                return // graceful close
              }
            }
            return yield* new ConnectionError({ cause })
          }),
        ),
        Effect.ensuring(
          Effect.all([
            Effect.forEach(
              Object.values(pending),
              (deferred) => Deferred.fail(deferred, ClosedBeforeResolvedError.make()),
              { concurrency: "unbounded" },
            ),
            Deferred.fail(closed, ClosedBeforeResolvedError.make()),
            PubSub.shutdown(pubsub),
          ]),
        ),
        Effect.forkScoped,
      )

    const f: F<ClientSelf, MethodDefinitions> = (_tag) =>
      Effect.fnUntraced(function* (payload) {
        const id = nextId++
        const deferred = yield* Deferred.make<Success, Failure>()
        pending[id] = deferred
        yield* S.encode(S.parseJson(client.schema.call))({
          _tag: "Call",
          id,
          payload: { _tag, ...payload },
        }).pipe(Effect.flatMap(write))
        return yield* Deferred.await(deferred).pipe(Effect.raceFirst(Deferred.await(closed)))
      })

    return { pubsub, replay, f }
  }).pipe((acquire) => RcRef.make({ acquire }), Layer.scoped(client))

export const layerPlatform = <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>(
  client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>,
): Layer.Layer<ClientSelf, never, Worker.PlatformWorker | Worker.Spawner> =>
  RcRef.make({
    acquire: Effect.gen(function* () {
      type D = MethodDefinitions[keyof MethodDefinitions]
      type Success = D["success"]["Type"]
      type Failure = D["failure"]["Type"]

      const manager = yield* Worker.makeManager
      const worker = yield* manager
        .spawn<
          Protocol.CallMessage.Type<MethodDefinitions> | typeof Protocol.AuditionMessage.Type,
          Protocol.ActorMessage.Type<MethodDefinitions, EventDefinitions>,
          never
        >({})
        .pipe(Effect.catchTag("WorkerError", (cause) => ConnectionError.make({ cause })))

      const pubsub = yield* PubSub.unbounded<FieldsRecord.TaggedMember.Type<EventDefinitions>>()
      const replay = yield* PubSub.subscribe(pubsub)

      const pending: Record<string, Deferred.Deferred<Success, Failure>> = {}
      let nextId = 0
      const send = (message: Protocol.CallMessage.Type<MethodDefinitions>) => worker.executeEffect(message)
      const auditioned = yield* Deferred.make<void, AuditionError>()
      const closed = yield* Deferred.make<never, ClosedBeforeResolvedError>()

      const clientId = client.key
      // TODO: audition erroring and closing
      yield* worker.execute(Protocol.AuditionMessage.make({ clientId })).pipe(
        Stream.catchTag("WorkerError", (cause) => ConnectionError.make({ cause })),
        Stream.runForEach(
          Effect.fnUntraced(function* (message) {
            yield* Deferred.succeed(auditioned, void 0)
            switch (message._tag) {
              case "Event": {
                yield* pubsub.publish(message.event)
                break
              }
              case "Success": {
                const deferred = pending[message.id]
                if (deferred) {
                  delete pending[message.id]
                  yield* Deferred.succeed(deferred, message.value.value)
                }
                break
              }
              case "Failure": {
                const deferred = pending[message.id]
                if (deferred) {
                  delete pending[message.id]
                  yield* Deferred.fail(deferred, message.cause.value)
                }
                break
              }
            }
          }),
        ),
        Effect.ensuring(
          Effect.all([
            Effect.forEach(
              Object.values(pending),
              (deferred) => Deferred.fail(deferred, ClosedBeforeResolvedError.make()),
              { concurrency: "unbounded" },
            ),
            Deferred.fail(closed, ClosedBeforeResolvedError.make()),
            PubSub.shutdown(pubsub),
          ]),
        ),
        Effect.forkScoped,
      )

      yield* Deferred.await(auditioned)

      const f: F<ClientSelf, MethodDefinitions> = (_tag) =>
        Effect.fnUntraced(function* (payload) {
          const id = nextId++
          const deferred = yield* Deferred.make<Success, Failure>()
          pending[id] = deferred
          yield* send({
            _tag: "Call",
            id,
            payload: { _tag, ...payload },
          }).pipe(Effect.catchTag("WorkerError", (cause) => ConnectionError.make({ cause })))
          return yield* Deferred.await(deferred).pipe(Effect.raceFirst(Deferred.await(closed)))
        })

      return { pubsub, replay, f }
    }),
  }).pipe(Layer.scoped(client))
