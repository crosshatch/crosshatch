import type { Effect } from "effect"

import { Payload, Requirements } from "../X402/X402.ts"
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
