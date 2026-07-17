import { Effect } from "effect"

import { FacilitatorApi } from "../../Facilitator/FacilitatorApi.ts"
import { handler } from "./_common.ts"

export const handleSettle = handler(
  FacilitatorApi,
  "facilitator",
  "settle",
  Effect.fn(function* ({ payload: { paymentPayload, paymentRequirements } }) {
    console.log({ paymentPayload, paymentRequirements })
    return null!
  }),
)
