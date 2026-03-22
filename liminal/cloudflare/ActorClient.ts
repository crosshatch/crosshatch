import type { FieldsRecord, RequestDefinition } from "@crosshatch/util/schema"

import { Socket } from "@effect/platform"
import { Effect, Schema as S, Layer, PubSub, ParseResult, Deferred, Exit, Cause } from "effect"

import * as Client from "../Client.ts"

export const layerSocket = <
  ClientSelf,
  ClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
>({
  client,
  baseUrl,
  protocols,
}: {
  readonly client: Client.Client<ClientSelf, ClientId, RequestDefinitions, EventDefinitions>
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
    type Success = RequestDefinitions[number]["success"]["Type"]
    type Failure = RequestDefinitions[number]["failure"]["Type"]
    const pending: Record<string, Deferred.Deferred<Success, Failure>> = {}
    yield* socket.run(
      Effect.fnUntraced(function* (raw) {
        const message = yield* S.decodeUnknown(client.actorMessageSchema)(new TextDecoder().decode(raw))
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
    const f: Client.F<ClientSelf, RequestDefinitions> = (_tag) =>
      Effect.fnUntraced(function* (v) {
        let id = i++
        const deferred = yield* Deferred.make<Success, Failure>()
        pending[id] = deferred
        yield* S.encode(client.requestSchema)({
          _tag: "Request",
          id,
          payload: v,
        }).pipe(Effect.andThen(write))
        return yield* Deferred.await(deferred)
      })
    return {
      f,
      eventsPubsub,
    }
  }).pipe(Layer.scoped(client))
