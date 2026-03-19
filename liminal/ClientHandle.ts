import type { FieldsRecord, Fields } from "@crosshatch/util/schema"

import { WebSocket } from "@cloudflare/workers-types"
import { Headers } from "@effect/platform"
import { Schema as S, Effect, Ref } from "effect"

const TypeId = "~liminal/ClientHandle" as const

export type Send<EventDefinitions extends FieldsRecord, ActorSelf> = <Tag extends keyof EventDefinitions>(
  tag: Tag,
  payload: S.Struct<EventDefinitions[Tag]>["Type"],
) => Effect.Effect<void, never, ActorSelf>

export interface ClientHandle<ActorSelf, AttachmentFields extends Fields, EventDefinitions extends FieldsRecord> {
  readonly [TypeId]: typeof TypeId

  readonly headers: Headers.Headers

  readonly attachmentsRef: Ref.Ref<S.Struct<AttachmentFields>["Type"]>

  readonly send: Send<EventDefinitions, ActorSelf>

  readonly disconnect: Effect.Effect<void, never, ActorSelf>
}

export const make =
  <ActorSelf>() =>
  <AttachmentsFields extends Fields, EventDefinitions extends FieldsRecord>(_config: {
    socket: WebSocket
    headers: Headers.Headers
    attachments: S.Struct<AttachmentsFields>["Type"]
    attachmentsSchema: S.Schema<S.Struct<AttachmentsFields>["Type"], S.Struct<AttachmentsFields>["Encoded"]>
    events: EventDefinitions
  }): ClientHandle<ActorSelf, AttachmentsFields, EventDefinitions> => {
    throw 0
  }
