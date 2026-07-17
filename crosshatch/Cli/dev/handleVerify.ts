import { Effect } from "effect"

import { FacilitatorApi } from "../../Facilitator/FacilitatorApi.ts"
import { handler } from "./_common.ts"

export const handleVerify = handler(
  FacilitatorApi,
  "facilitator",
  "verify",
  Effect.fn(function* ({ payload: { paymentPayload, paymentRequirements } }) {
    console.log({ paymentPayload, paymentRequirements })
    return null!
  }),
)
