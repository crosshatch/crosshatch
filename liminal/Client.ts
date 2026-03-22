import { Socket, Worker } from "@effect/platform"
import {
  ParseResult,
  Exit,
  Deferred,
  Cause,
  Layer,
  Record,
  Context,
  Stream,
  Effect,
  Schema as S,
  PubSub,
  Data,
} from "effect"

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
  readonly eventsPubsub: PubSub.PubSub<FieldsRecord.TaggedMember<EventDefinitions>>

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
    readonly call: S.Schema<Protocol.CallMessage<MethodDefinitions>, string>

    readonly success: S.Schema<Protocol.SuccessMessage<MethodDefinitions>, string>

    readonly failure: S.Schema<Protocol.FailureMessage<MethodDefinitions>, string>

    readonly event: S.Schema<Protocol.EventMessage<EventDefinitions>, string>

    readonly actor: S.Schema<
      | Protocol.SuccessMessage<MethodDefinitions>
      | Protocol.FailureMessage<MethodDefinitions>
      | Protocol.EventMessage<EventDefinitions>
      | typeof Protocol.DisconnectMessage.Type,
      string
    >
  }

  readonly events: Stream.Stream<FieldsRecord.TaggedMember<EventDefinitions>, ConnectionError, ClientSelf>

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

    const call: S.Schema<Protocol.CallMessage<MethodDefinitions>, string> = S.parseJson(
      S.TaggedStruct("Call", {
        id: S.Int,
        payload: S.Union(
          ...Object.entries(definition.methods).map(([_tag, { payload }]) => S.TaggedStruct(_tag, payload)),
        ),
      }),
    ) as never

    const success: S.Schema<Protocol.SuccessMessage<MethodDefinitions>, string> = S.parseJson(
      S.TaggedStruct("Success", {
        id: S.Int,
        value: S.Union(...Object.values(definition.methods).map(({ success }) => success)),
      }),
    )

    const failure: S.Schema<Protocol.FailureMessage<MethodDefinitions>, string> = S.parseJson(
      S.TaggedStruct("Failure", {
        id: S.Int,
        cause: S.Union(...Object.values(definition.methods).map(({ failure }) => failure)),
      }),
    )

    const event: S.Schema<Protocol.EventMessage<EventDefinitions>, string> = S.parseJson(
      S.TaggedStruct("Event", {
        event: S.Union(...Object.entries(definition.events).map(([_tag, fields]) => S.TaggedStruct(_tag, fields))),
      }),
    ) as never

    const actor = S.Union(success, failure, event, Protocol.DisconnectMessage)

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
  baseUrl,
  protocols,
}: {
  readonly client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>
  readonly baseUrl: string
  readonly protocols?: string | Array<string> | undefined
}): Layer.Layer<
  ClientSelf,
  Socket.SocketError | ParseResult.ParseError | Cause.NoSuchElementException,
  Socket.WebSocketConstructor
> =>
  Effect.gen(function* () {
    const socket = yield* Socket.makeWebSocket(baseUrl, { protocols })
    const write = yield* socket.writer
    const eventsPubsub = yield* PubSub.unbounded<FieldsRecord.TaggedMember<EventDefinitions>>()
    let i = 0
    type D = MethodDefinitions[keyof MethodDefinitions]
    type Success = D["success"]["Type"]
    type Failure = D["failure"]["Type"]
    const pending: Record<string, Deferred.Deferred<Success, Failure>> = {}
    yield* socket.run(
      Effect.fnUntraced(function* (raw) {
        const message = yield* S.decodeUnknown(client.schema.actor)(new TextDecoder().decode(raw))
        switch (message._tag) {
          case "Disconnect": {
            return yield* write(new Socket.CloseEvent())
          }
          case "Event": {
            return yield* eventsPubsub.publish(message.event)
          }
          case "Success": {
            const { id, value } = message
            const deferred = yield* Effect.fromNullable(pending[id])
            return yield* Deferred.done(deferred, Exit.succeed(value))
          }
          case "Failure": {
            const { id, cause } = message
            const deferred = yield* Effect.fromNullable(pending[id])
            return yield* Deferred.done(deferred, Exit.succeed(cause))
          }
        }
      }),
    )
    const f: F<ClientSelf, MethodDefinitions> = (_tag) =>
      Effect.fnUntraced(function* (payload) {
        let id = i++
        const deferred = yield* Deferred.make<Success, Failure>()
        pending[id] = deferred
        yield* S.encode(client.schema.call)({
          _tag: "Call",
          id,
          payload: { _tag, ...payload },
        }).pipe(Effect.andThen(write))
        return yield* Deferred.await(deferred)
      })
    return { f, eventsPubsub }
  }).pipe(Layer.scoped(client))

export const layerPlatform = <
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>(
  _client: Client<ClientSelf, ClientId, MethodDefinitions, EventDefinitions>,
): Layer.Layer<ClientSelf, never, Worker.PlatformWorker | Worker.Spawner> => null!
