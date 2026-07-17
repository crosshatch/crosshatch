import { verifyX402Payment } from "@distilled.cloud/coinbase"
import { FacilitatorApi } from "crosshatch/FacilitatorApi"
import { Effect } from "effect"

import { handler } from "./_common.ts"

export const handleVerify = handler(
  FacilitatorApi,
  "facilitator",
  "verify",
  ({ payload: { paymentPayload, paymentRequirements } }) =>
    verifyX402Payment({
      x402Version: 2,
      paymentPayload: paymentPayload as never,
      paymentRequirements: paymentRequirements as never,
    }).pipe(
      Effect.map((v) => v as never),
      Effect.orDie,
    ),
)
