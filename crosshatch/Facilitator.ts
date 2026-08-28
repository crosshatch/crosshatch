import { Config, Context, Effect, Layer, Schema as S, Option } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { Address } from "./Address.ts"
import { ChainId } from "./ChainId.ts"
import { type FacilitatorApiGroup, FacilitatorApi } from "./FacilitatorApi/index.ts"
import type { Payload } from "./Payload.ts"

/** @effect-expect-leaking [Mode] extends ["response-only"] ? never : never */
export class Facilitator extends Context.Service<
  Facilitator,
  HttpApiClient.Client<typeof FacilitatorApiGroup>["facilitator"]
>()("crosshatch/Facilitator") {}

export const layer = (config?: { readonly baseUrl?: string | undefined }) =>
  Layer.effect(
    Facilitator,
    Effect.gen(function* () {
      const baseUrl =
        config?.baseUrl ??
        (yield* Config.all({
          host: Config.string("CROSSHATCH_DEV_HOST").pipe(Config.withDefault("localhost")),
          port: Config.port("CROSSHATCH_DEV_PORT"),
        }).pipe(
          Effect.option,
          Effect.map(
            Option.match({
              onSome: ({ host, port }) => `http://${host.includes(":") ? `[${host}]` : host}:${port}`,
              onNone: () => config?.baseUrl ?? "https://cirque.sh/facilitator",
            }),
          ),
        ))
      const { facilitator } = yield* HttpApiClient.make(FacilitatorApi, { baseUrl })
      return facilitator
    }),
  )

export class VerificationError extends S.TaggedError<VerificationError>()("VerificationError", {
  invalidReason: S.String.pipe(S.optional),
  invalidMessage: S.String.pipe(S.optional),
  payer: Address.pipe(S.optional),
}) {}

export const verify = Effect.fnUntraced(function* ({ payload }: { readonly payload: Payload }) {
  const facilitator = yield* Facilitator
  const { accepted: paymentRequirements, x402Version } = payload
  const response = yield* facilitator.verify({
    payload: {
      x402Version,
      paymentPayload: payload,
      paymentRequirements,
    },
  })
  if (!response.isValid) {
    return yield* VerificationError.make(response)
  }
  return response
})

export class SettlementError extends S.TaggedError<SettlementError>()("SettlementError", {
  errorReason: S.String.pipe(S.optional),
  errorMessage: S.String.pipe(S.optional),
  payer: Address.pipe(S.optional),
  transaction: S.String,
  network: ChainId,
}) {}

export const settle = Effect.fnUntraced(function* ({ payload }: { readonly payload: Payload }) {
  const facilitator = yield* Facilitator
  const { accepted: paymentRequirements, x402Version } = payload
  const response = yield* facilitator.settle({
    payload: {
      x402Version,
      paymentPayload: payload,
      paymentRequirements,
    },
  })
  if (!response.success) {
    return yield* SettlementError.make(response)
  }
  return response
})
