import { Facilitator } from "crosshatch"
import { Effect } from "effect"

import { handler } from "./_common.ts"

export const handleVerify = handler(
  Facilitator.FacilitatorApi,
  "facilitator",
  "verify",
  Effect.fn(function* ({ payload: { paymentPayload, paymentRequirements } }) {
    console.log({ paymentPayload, paymentRequirements })
    return null!
  }),
)
