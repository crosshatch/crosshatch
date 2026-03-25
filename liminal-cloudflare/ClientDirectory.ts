import type { Fields, FieldsRecord } from "liminal/_types"

import { Schema as S, Effect, Ref, Cause, ParseResult } from "effect"
import { Method, Actor, ClientHandle } from "liminal"

export interface ClientDirectory<ActorSelf, AttachmentFields extends Fields, EventDefinitions extends FieldsRecord> {
  readonly Handle: ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>

  readonly handles: ReadonlySet<this["Handle"]>

  readonly register: (
    socket: WebSocket,
    attachments: { [K in keyof S.Struct.Type<AttachmentFields>]: S.Struct.Type<AttachmentFields>[K] },
  ) => Effect.Effect<this["Handle"], ParseResult.ParseError, never>

  readonly look: (socket: WebSocket) => Effect.Effect<this["Handle"], Cause.NoSuchElementException, never>

  readonly unregister: (socket: WebSocket) => Effect.Effect<void, Cause.NoSuchElementException, never>
}

export const make = <
  ActorSelf,
  ActorId extends string,
  NameA,
  AttachmentFields extends Fields,
  ClientSelf,
  ClientId extends string,
  MethodDefinitions extends Record<string, Method.MethodDefinition.Any>,
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
      attachments,
      client: {
        schema: { event },
      },
    },
  } = actor

  type Handle = ClientHandle.ClientHandle<ActorSelf, AttachmentFields, EventDefinitions>

  const sockets = new Map<WebSocket, Handle>()
  const handles = new Set<Handle>()
  const attachmentsSchema: S.Schema<S.Struct<AttachmentFields>["Type"], S.Struct<AttachmentFields>["Encoded"]> =
    S.Struct(attachments) as never

  const look = (socket: WebSocket) => Effect.fromNullable(sockets.get(socket))

  const register = Effect.fnUntraced(function* (
    socket: WebSocket,
    attachments: S.Struct<AttachmentFields>["Type"],
  ): Effect.fn.Return<Handle, ParseResult.ParseError> {
    const encoded = yield* S.encode(attachmentsSchema)(attachments)
    socket.serializeAttachment(encoded)
    const attachmentsRef = yield* Ref.make(attachments)
    const handle = ClientHandle.make<ActorSelf, AttachmentFields, EventDefinitions>({
      attachments: Ref.get(attachmentsRef),
      save: Effect.fnUntraced(function* (value) {
        yield* Ref.set(attachmentsRef, value)
        socket.serializeAttachment(yield* S.encode(attachmentsSchema)(value))
      }),
      send: (_tag, payload) =>
        S.encode(S.parseJson(event))({
          _tag: "Event",
          event: { _tag, ...payload },
        }).pipe(Effect.andThen(socket.send)),
      disconnect: Effect.sync(() => {
        socket.send("1")
        sockets.delete(socket)
        handles.delete(handle)
      }),
    })
    sockets.set(socket, handle)
    handles.add(handle)
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
