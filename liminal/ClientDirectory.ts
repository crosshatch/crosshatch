import { WebSocket } from "@cloudflare/workers-types"
import { Schema as S, Effect, Ref, Cause } from "effect"

import type { FieldsRecord } from "./_type_util.ts"
import type { MethodDefinition } from "./Method.ts"

import * as Actor from "./Actor.ts"
import * as ClientHandle from "./ClientHandle.ts"
import { DisconnectMessage } from "./Protocol.ts"

export interface ClientDirectory<
  ActorSelf,
  AttachmentFields extends S.Struct.Fields,
  EventDefinitions extends FieldsRecord,
> {
  readonly Handle: ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>

  readonly handles: ReadonlySet<this["Handle"]>

  readonly register: (
    socket: WebSocket,
    attachments: { [K in keyof S.Struct.Type<AttachmentFields>]: S.Struct.Type<AttachmentFields>[K] },
  ) => Effect.Effect<this["Handle"], never, never>

  readonly look: (socket: WebSocket) => Effect.Effect<this["Handle"], Cause.NoSuchElementException, never>

  readonly unregister: (socket: WebSocket) => Effect.Effect<void, Cause.NoSuchElementException, never>
}

export const make = <
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends S.Struct.Fields,
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, MethodDefinition.Any>,
  EventDefinitions extends FieldsRecord,
>(
  actor: Actor.Actor<
    ActorSelf,
    ActorId,
    NameA,
    AttachmentFields,
    ClientSelf,
    ClientId,
    MethodDefinitions,
    EventDefinitions
  >,
): ClientDirectory<ActorSelf, AttachmentFields, EventDefinitions> => {
  const {
    definition: {
      client: {
        schema: { event },
      },
    },
  } = actor

  type Handle = ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>

  const sockets = new Map<WebSocket, Handle>()
  const handles = new Set<Handle>()

  const look = (socket: WebSocket) => Effect.fromNullable(sockets.get(socket))

  const register = Effect.fnUntraced(function* (
    socket: WebSocket,
    attachments: S.Struct<AttachmentFields>["Type"],
  ): Effect.fn.Return<Handle> {
    const attachmentsRef = yield* Ref.make(attachments)
    const handle = ClientHandle.make<ActorSelf, AttachmentFields, EventDefinitions>({
      attachments: Ref.get(attachmentsRef),
      save: Effect.fnUntraced(function* (value) {
        yield* Ref.set(attachmentsRef, value)
        socket.serializeAttachment(value)
      }),
      send: (_tag, payload) =>
        S.encode(event)({
          _tag: "Event",
          event: { _tag, ...payload },
        }).pipe(Effect.andThen(socket.send)),
      disconnect: Effect.gen(function* () {
        yield* S.encode(DisconnectMessage)({ _tag: "Disconnect" }).pipe(Effect.andThen(socket.send))
        sockets.delete(socket)
        handles.delete(handle)
      }),
    })
    return handle
  })

  const unregister = Effect.fnUntraced(function* (socket: WebSocket) {
    const handle = yield* look(socket)
    sockets.delete(socket)
    handles.delete(handle)
  })

  return {
    Handle: null!,
    handles,
    register,
    look,
    unregister,
  }
}
