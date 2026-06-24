import { type Effect, Context } from "effect"

import type { Payload, Requirements } from "../X402/X402.ts"
import type { CreatePayloadError } from "./errors.ts"

export interface CaChain {
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
    Context.Service<Self, CaChain>()(id)
