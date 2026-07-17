import { Context, Effect, Layer, Schema as S, UndefinedOr } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { FacilitatorApiGroup, FacilitatorApi } from "./FacilitatorApi/FacilitatorApi.ts"
import { Payload } from "./Payload.ts"
import { Stage } from "./Stage.ts"

/** @effect-expect-leaking [Mode] extends ["response-only"] ? never : never */
export class Facilitator extends Context.Service<
  Facilitator,
  HttpApiClient.Client<typeof FacilitatorApiGroup>["facilitator"]
>()("crosshatch/Facilitator") {}

export const layer = Effect.fnUntraced(function* (config?: { readonly baseUrl?: string | undefined }) {
  const baseUrl = yield* UndefinedOr.match(config?.baseUrl, {
    onDefined: Effect.succeed,
    onUndefined: () => Stage.pipe(Effect.map(({ url }) => url("facilitator"))),
  })
  return yield* HttpApiClient.make(FacilitatorApi, { baseUrl }).pipe(Effect.map(({ facilitator }) => facilitator))
}, Layer.effect(Facilitator))

export class VerificationError extends S.TaggedErrorClass<VerificationError>()("VerificationError", {
  invalidReason: S.String.pipe(S.optional),
  invalidMessage: S.String.pipe(S.optional),
}) {}

export const verify = Effect.fnUntraced(function* ({ payload }: { readonly payload: Payload }) {
  const facilitator = yield* Facilitator
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

export class SettlementError extends S.TaggedErrorClass<SettlementError>()("SettlementError", {
  errorReason: S.String.pipe(S.optional),
  errorMessage: S.String.pipe(S.optional),
}) {}

export const settle = Effect.fnUntraced(function* ({ payload }: { readonly payload: Payload }) {
  const facilitator = yield* Facilitator
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
