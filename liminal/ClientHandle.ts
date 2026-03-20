import type { Fields, FieldsRecord } from "@crosshatch/util/schema"

import { Schema as S, Effect } from "effect"

const TypeId = "~liminal/ClientHandle" as const

export type Send<ActorSelf, EventDefinitions extends FieldsRecord> = <K extends keyof EventDefinitions>(
  tag: K,
  payload: S.Struct<EventDefinitions[K]>["Type"],
) => Effect.Effect<void, never, ActorSelf>

export interface ClientHandle<ActorSelf, AttachmentFields extends Fields, EventDefinitions extends FieldsRecord> {
  readonly [TypeId]: typeof TypeId

  readonly send: Send<ActorSelf, EventDefinitions>

  readonly attachments: Effect.Effect<S.Struct<AttachmentFields>["Type"], never, ActorSelf>

  readonly save: (attachments: S.Struct<AttachmentFields>["Type"]) => Effect.Effect<void, never, ActorSelf>

  readonly disconnect: Effect.Effect<void, never, ActorSelf>
}
