import { handler } from "@crosshatch/util/httpapi"
import { FacilitatorApi } from "@crosshatch/x402"
import { verifyX402Payment } from "@distilled.cloud/coinbase"
import { Effect } from "effect"

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
