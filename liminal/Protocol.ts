import type { FieldsRecord } from "@crosshatch/util/schema"

import { Schema as S } from "effect"

import type { MethodDefinition } from "./Method.ts"

export type CallMessage<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
  readonly _tag: "Call"
  readonly id: number
  readonly payload: {
    [K in keyof MethodDefinitions]: {
      readonly _tag: K
    } & S.Struct<MethodDefinitions[K]["payload"]>["Type"]
  }[keyof MethodDefinitions]
}

export type SuccessMessage<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
  readonly _tag: "Success"
  readonly id: number
  readonly value: MethodDefinitions[keyof MethodDefinitions]["success"]["Type"]
}

export type FailureMessage<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
  readonly _tag: "Failure"
  readonly id: number
  readonly cause: MethodDefinitions[keyof MethodDefinitions]["failure"]["Type"]
}

export type EventMessage<EventDefinitions extends FieldsRecord> = {
  readonly _tag: "Event"
  readonly event: FieldsRecord.TaggedMember<EventDefinitions>
}

export const DisconnectMessage = S.parseJson(S.TaggedStruct("Disconnect", {}))
