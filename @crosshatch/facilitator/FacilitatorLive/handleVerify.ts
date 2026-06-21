import { verifyX402Payment } from "@distilled.cloud/coinbase"
import { FacilitatorApi } from "crosshatch/X402"
import { Effect } from "effect"

import { handler } from "./_common.ts"

export const handleVerify = handler(
  FacilitatorApi,
  "facilitator",
  "verify",
  ({ payload: { paymentPayload, paymentRequirements } }) =>
    verifyX402Payment({
      x402Version: 2,
      paymentPayload,
      paymentRequirements,
    }).pipe(Effect.orDie),
)
