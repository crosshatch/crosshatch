import { Config, Context, Effect, Layer, Schema as S, Option } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { FacilitatorApiGroup, FacilitatorApi } from "./FacilitatorApi/FacilitatorApi.ts"
import { Payload } from "./Payload.ts"

/** @effect-expect-leaking [Mode] extends ["response-only"] ? never : never */
export class Facilitator extends Context.Service<
  Facilitator,
  HttpApiClient.Client<typeof FacilitatorApiGroup>["facilitator"]
>()("crosshatch/Facilitator") {}

export const layer = (config?: { readonly baseUrl?: string | undefined }) =>
  Layer.effect(
    Facilitator,
    Effect.gen(function* () {
      const baseUrl = yield* Config.all({
        host: Config.port("CROSSHATCH_DEV_HOST"),
        port: Config.port("CROSSHATCH_DEV_PORT"),
        https: Config.boolean("CROSSHATCH_DEV_HTTPS"),
      }).pipe(
        Effect.option,
        Effect.map(
          Option.match({
            onSome: ({ https, host, port }) => `http${https ? "s" : ""}://${host}:${port}`,
            onNone: () => config?.baseUrl ?? "https://cirque.sh",
          }),
        ),
      )
      const { facilitator } = yield* HttpApiClient.make(FacilitatorApi, { baseUrl })
      return facilitator
    }),
  )

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
