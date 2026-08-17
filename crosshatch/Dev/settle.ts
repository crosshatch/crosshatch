import { handler } from "@crosshatch/util"
import { Effect } from "effect"

import { FacilitatorApi } from "../FacilitatorApi/index.ts"

export const settle = handler(FacilitatorApi, "facilitator", "settle", ({ payload: { paymentRequirements } }) =>
  Effect.succeed({
    success: true,
    transaction: "0x0000000000000000000000000000000000000000000000000000000000000000",
    network: paymentRequirements.network,
  }),
)
