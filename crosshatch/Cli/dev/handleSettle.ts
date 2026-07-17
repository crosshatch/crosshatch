import { Effect } from "effect"

import { FacilitatorApi } from "../../FacilitatorApi/FacilitatorApi.ts"
import { handler } from "./_common.ts"

export const handleSettle = handler(FacilitatorApi, "facilitator", "settle", ({ payload: { paymentRequirements } }) =>
  Effect.succeed({
    success: true,
    transaction: "0x0000000000000000000000000000000000000000000000000000000000000000",
    network: paymentRequirements.network,
  }),
)
