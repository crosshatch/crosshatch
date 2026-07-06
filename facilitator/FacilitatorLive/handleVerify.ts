import { verifyX402Payment } from "@distilled.cloud/coinbase"
import { Facilitator } from "crosshatch"
import { Effect } from "effect"

import { handler } from "./_common.ts"

export const handleVerify = handler(
  Facilitator.FacilitatorApi,
  "facilitator",
  "verify",
  ({ payload: { paymentPayload, paymentRequirements } }) =>
    verifyX402Payment({
      x402Version: 2,
      paymentPayload: paymentPayload as never,
      paymentRequirements: paymentRequirements as never,
    }).pipe(Effect.orDie),
)
