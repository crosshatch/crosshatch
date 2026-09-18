import { Effect } from "effect"
import { HttpApiBuilder } from "effect/unstable/httpapi"

import { FacilitatorApi } from "../FacilitatorApi/index.ts"

export const settle = HttpApiBuilder.handler(
  FacilitatorApi,
  "facilitator",
  "settle",
  ({ payload: { paymentRequirements } }) =>
    Effect.succeed({
      success: true,
      transaction: "0x0000000000000000000000000000000000000000000000000000000000000000",
      network: paymentRequirements.network,
    }),
)
