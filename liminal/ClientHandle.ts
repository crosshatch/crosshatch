import type { Fields, FieldsRecord } from "@crosshatch/util/schema"

import { WebSocket } from "@cloudflare/workers-types"
import { Schema as S, Effect, Ref, ParseResult } from "effect"

import type { MethodDefinition } from "./Method.ts"

import * as Actor from "./Actor.ts"
import { DisconnectMessage } from "./Protocol.ts"

const TypeId = "~liminal/ClientHandle" as const

export type Send<ActorSelf, EventDefinitions extends FieldsRecord> = <K extends keyof EventDefinitions>(
  tag: K,
  payload: S.Struct<EventDefinitions[K]>["Type"],
) => Effect.Effect<void, ParseResult.ParseError, ActorSelf>

export interface ClientHandle<ActorSelf, AttachmentFields extends Fields, EventDefinitions extends FieldsRecord> {
  readonly [TypeId]: typeof TypeId

  readonly send: Send<ActorSelf, EventDefinitions>

  readonly attachments: Effect.Effect<S.Struct<AttachmentFields>["Type"]>

  readonly save: (attachments: S.Struct<AttachmentFields>["Type"]) => Effect.Effect<void>

  readonly disconnect: Effect.Effect<void, ParseResult.ParseError, ActorSelf>
}

export const makeDirectory = <
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>({
  definition: {
    client: { eventSchema },
  },
}: Actor.Actor<
  ActorSelf,
  ActorId,
  NameA,
  AttachmentFields,
  ClientSelf,
  ClientId,
  MethodDefinitions,
  EventDefinitions
>) => {
  type Handle = ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>

  const sockets = new Map<WebSocket, Handle>()
  const handles = new Set<Handle>()

  const look = (socket: WebSocket) => Effect.fromNullable(sockets.get(socket))

  const unregister = Effect.fnUntraced(function* (socket: WebSocket) {
    const handle = yield* look(socket)
    sockets.delete(socket)
    handles.delete(handle)
  })

  const register = Effect.fnUntraced(function* (
    socket: WebSocket,
    attachments: S.Struct<AttachmentFields>["Type"],
  ): Effect.fn.Return<Handle> {
    const attachmentsRef = yield* Ref.make(attachments)
    const handle: Handle = {
      [TypeId]: TypeId,
      attachments: Ref.get(attachmentsRef),
      save: Effect.fnUntraced(function* (value) {
        yield* Ref.set(attachmentsRef, value)
        socket.serializeAttachment(value)
      }),
      send: (_tag, payload) =>
        S.encode(eventSchema)({
          _tag: "Event",
          event: { _tag, ...payload },
        }).pipe(Effect.andThen(socket.send)),
      disconnect: Effect.gen(function* () {
        yield* S.encode(DisconnectMessage)({ _tag: "Disconnect" }).pipe(Effect.andThen(socket.send))
        sockets.delete(socket)
        handles.delete(handle)
      }),
    }
    return handle
  })

  return { handles, register, look, unregister }
}
