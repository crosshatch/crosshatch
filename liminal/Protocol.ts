import { Schema as S } from "effect"

import type { FieldsRecord } from "./_types.ts"
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

    readonly value: {
      readonly [K in keyof MethodDefinitions]: {
        readonly _tag: K
        readonly value: MethodDefinitions[K]["success"]["Type"]
      }
    }[keyof MethodDefinitions]
  }

  export type Encoded<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
    readonly _tag: "Success"

    readonly id: number

    readonly value: {
      readonly [K in keyof MethodDefinitions]: {
        readonly _tag: K
        readonly value: MethodDefinitions[K]["success"]["Encoded"]
      }
    }[keyof MethodDefinitions]
  }
}

export declare namespace FailureMessage {
  export type Type<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
    readonly _tag: "Failure"

    readonly id: number

    readonly cause: {
      readonly [K in keyof MethodDefinitions]: {
        readonly _tag: K
        readonly value: MethodDefinitions[K]["failure"]["Type"]
      }
    }[keyof MethodDefinitions]
  }

  export type Encoded<MethodDefinitions extends Record<string, MethodDefinition.Any>> = {
    readonly _tag: "Failure"

    readonly id: number

    readonly cause: {
      readonly [K in keyof MethodDefinitions]: {
        readonly _tag: K
        readonly value: MethodDefinitions[K]["failure"]["Encoded"]
      }
    }[keyof MethodDefinitions]
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

export const AuditionMessage = S.TaggedStruct("Audition", {
  clientId: S.String,
})

export class AuditionFailure extends S.TaggedError<AuditionFailure>()("AuditionFailure", {
  expected: S.String,
  actual: S.String,
}) {}

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
