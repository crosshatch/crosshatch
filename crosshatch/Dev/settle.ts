import { Effect } from "effect"

import { handler } from "../_util.ts"
import { FacilitatorApi } from "../FacilitatorApi/FacilitatorApi.ts"

export const settle = handler(FacilitatorApi, "facilitator", "settle", ({ payload: { paymentRequirements } }) =>
  Effect.succeed({
    success: true,
    transaction: "0x0000000000000000000000000000000000000000000000000000000000000000",
    network: paymentRequirements.network,
  }),
)
