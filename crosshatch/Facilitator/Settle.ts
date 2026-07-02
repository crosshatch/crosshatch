import { Effect, Schema as S } from "effect"

import type { Payload } from "../Payload.ts"
import { FacilitatorClient } from "./FacilitatorClient.ts"

export class SettlementError extends S.TaggedErrorClass<SettlementError>()("SettlementError", {
  errorReason: S.String.pipe(S.optional),
  errorMessage: S.String.pipe(S.optional),
}) {}

export const settle = Effect.fnUntraced(function* ({ payload }: { readonly payload: typeof Payload.Type }) {
  const facilitator = yield* FacilitatorClient
  const { accepted: paymentRequirements } = payload
  const response = yield* facilitator.settle({
    payload: {
      paymentPayload: payload,
      paymentRequirements,
    },
  })
  if (!response.success) {
    return yield* new SettlementError(response)
  }
  return response
})
