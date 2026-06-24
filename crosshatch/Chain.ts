import { type Effect, Context } from "effect"

import type { CreatePayloadError } from "./errors.ts"
import type { Payload, Requirements } from "./X402/X402.ts"

export interface Chain {
  readonly createPayload: ({
    requirements,
  }: {
    readonly requirements: typeof Requirements.Requirements.Type
  }) => Effect.Effect<
    {
      readonly payload: typeof Payload.Payload.Type
    },
    CreatePayloadError
  >
}

export const Service =
  <Self>() =>
  <Id extends string>(id: Id) =>
    Context.Service<Self, Chain>()(id)
