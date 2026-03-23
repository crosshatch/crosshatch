import { Schema as S } from "effect"

import type { FieldsRecord } from "./_type_util.ts"
import type { MethodDefinition } from "./Method.ts"

export declare namespace CallMessage {
  export type Type<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
    readonly _tag: "Call"

    readonly id: number

    readonly payload: {
      [K in keyof MethodDefinitions]: {
        readonly _tag: K
      } & S.Struct<MethodDefinitions[K]["payload"]>["Type"]
    }[keyof MethodDefinitions]
  }

  export type Encoded<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
    readonly _tag: "Call"

    readonly id: number

    readonly payload: {
      [K in keyof MethodDefinitions]: {
        readonly _tag: K
      } & S.Struct<MethodDefinitions[K]["payload"]>["Encoded"]
    }[keyof MethodDefinitions]
  }
}

export declare namespace SuccessMessage {
  export type Type<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
    readonly _tag: "Success"

    readonly id: number

    readonly value: MethodDefinitions[keyof MethodDefinitions]["success"]["Type"]
  }

  export type Encoded<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
    readonly _tag: "Success"

    readonly id: number

    readonly value: MethodDefinitions[keyof MethodDefinitions]["success"]["Encoded"]
  }
}

export declare namespace FailureMessage {
  export type Type<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
    readonly _tag: "Failure"

    readonly id: number

    readonly cause: MethodDefinitions[keyof MethodDefinitions]["failure"]["Type"]
  }

  export type Encoded<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
    readonly _tag: "Failure"

    readonly id: number

    readonly cause: MethodDefinitions[keyof MethodDefinitions]["failure"]["Encoded"]
  }
}

export declare namespace EventMessage {
  export type Type<EventDefinitions extends FieldsRecord> = {
    readonly _tag: "Event"

    readonly event: FieldsRecord.TaggedMember.Type<EventDefinitions>
  }

  export type Encoded<EventDefinitions extends FieldsRecord> = {
    readonly _tag: "Event"

    readonly event: FieldsRecord.TaggedMember.Encoded<EventDefinitions>
  }
}

export const ConnectMessage = S.TaggedStruct("Connect", {})
export const DisconnectMessage = S.TaggedStruct("Disconnect", {})

export declare namespace ActorMessage {
  export type Type<
    MethodDefinitions extends Record<string, MethodDefinition.Any>,
    EventDefinitions extends FieldsRecord,
  > =
    | SuccessMessage.Type<MethodDefinitions>
    | FailureMessage.Type<MethodDefinitions>
    | EventMessage.Type<EventDefinitions>

  export type Encoded<
    MethodDefinitions extends Record<string, MethodDefinition.Any>,
    EventDefinitions extends FieldsRecord,
  > =
    | SuccessMessage.Encoded<MethodDefinitions>
    | FailureMessage.Encoded<MethodDefinitions>
    | EventMessage.Encoded<EventDefinitions>
}
