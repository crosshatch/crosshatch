import type { FieldsRecord, RequestDefinition } from "@crosshatch/util/schema"

import { Socket } from "@effect/platform"
import { Effect, Schema as S, Layer, PubSub } from "effect"

import * as ActorClient from "../ActorClient.ts"
import * as Protocol from "../Protocol.ts"

export const layerSocket = <
  ActorClientSelf,
  ActorClientId extends string,
  RequestDefinitions extends ReadonlyArray<RequestDefinition>,
  EventDefinitions extends FieldsRecord,
>({
  client,
  baseUrl,
  protocols,
}: {
  readonly client: ActorClient.ActorClient<ActorClientSelf, ActorClientId, RequestDefinitions, EventDefinitions>
  readonly baseUrl: string
  readonly protocols?: string | Array<string> | undefined
}): Layer.Layer<ActorClientSelf, never, Socket.WebSocketConstructor> =>
  Effect.gen(function* () {
    const socketConstructor = yield* Socket.WebSocketConstructor
    const socket = socketConstructor(baseUrl, protocols)
    const $m = Protocol.messages(client.definition)
    const eventsPubsub = yield* PubSub.unbounded<FieldsRecord.TaggedMember<EventDefinitions>>()
    socket.addEventListener("message", function f({ data }) {
      // TODO: effectify
      const message = S.decodeUnknownSync($m.ActorMessageJson)(data)
      console.log(message)
    })
    return {
      eventsPubsub,
    }
  }).pipe(Layer.effect(client))
