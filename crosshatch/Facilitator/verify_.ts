import { Effect, Schema as S } from "effect"

import type { Payload } from "../Payload.ts"
import { FacilitatorClient } from "./FacilitatorClient.ts"

export class VerificationError extends S.TaggedErrorClass<VerificationError>()("VerificationError", {
  invalidReason: S.String.pipe(S.optional),
  invalidMessage: S.String.pipe(S.optional),
}) {}

export const verify = Effect.fnUntraced(function* ({ payload }: { readonly payload: typeof Payload.Type }) {
  const facilitator = yield* FacilitatorClient
  const { accepted: paymentRequirements } = payload
  const response = yield* facilitator.verify({
    payload: {
      paymentPayload: payload,
      paymentRequirements,
    },
  })
  if (!response.isValid) {
    return yield* new VerificationError(response)
  }
})
