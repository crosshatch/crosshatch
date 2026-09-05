import { Config, Context, Effect, Layer, Schema as S } from "effect"
import { type HttpClientError, HttpServerResponse } from "effect/unstable/http"
import { HttpApiClient } from "effect/unstable/httpapi"

import { PAYMENT_RESPONSE } from "./_constants.ts"
import { AddressFromString } from "./Address.ts"
import { ChainFromString } from "./Chain.ts"
import {
  SettleResponseFromBase64JsonString,
  FacilitatorApi,
  type SettleResponse,
  type VerifyResponse,
  type SupportedResponse,
} from "./FacilitatorApi/index.ts"
import type { Payload } from "./Payload.ts"

// TODO: narrow verify and settle success.
export class Facilitator extends Context.Service<
  Facilitator,
  {
    readonly supported: SupportedEffect<never>
    readonly verify: Verify<never>
    readonly settle: Settle<never>
  }
>()("crosshatch/Facilitator") {}

export type FacilitatorClientError = HttpClientError.HttpClientError | S.SchemaError

export type SupportedEffect<R> = Effect.Effect<SupportedResponse, FacilitatorClientError, R>
export const supported: SupportedEffect<Facilitator> = Facilitator.pipe(Effect.flatMap((v) => v.supported))

export type Verify<R> = (
  payload: Payload,
) => Effect.Effect<VerifyResponse, VerificationError | FacilitatorClientError, R>
export const verify: Verify<Facilitator> = (payload) => Facilitator.pipe(Effect.flatMap((v) => v.verify(payload)))

export class VerificationError extends S.TaggedError<VerificationError>()("VerificationError", {
  invalidReason: S.String.pipe(S.optional),
  invalidMessage: S.String.pipe(S.optional),
  payer: AddressFromString.pipe(S.optional),
}) {}

export type Settle<R> = (payload: Payload) => Effect.Effect<SettleResponse, SettlementError | FacilitatorClientError, R>
export const settle: Settle<Facilitator> = (payload) => Facilitator.pipe(Effect.flatMap((v) => v.settle(payload)))

export class SettlementError extends S.TaggedError<SettlementError>()("SettlementError", {
  errorReason: S.String.pipe(S.optional),
  errorMessage: S.String.pipe(S.optional),
  payer: AddressFromString.pipe(S.optional),
  transaction: S.String,
  network: ChainFromString,
}) {}

export const layer = (baseUrl: string) =>
  Layer.effect(
    Facilitator,
    Effect.gen(function* () {
      const { facilitator } = yield* HttpApiClient.make(FacilitatorApi, { baseUrl })

      const supported = facilitator.supported()

      const verify = Effect.fnUntraced(function* (payload: Payload) {
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

      const settle = Effect.fnUntraced(function* (payload: Payload) {
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

      return { supported, verify, settle }
    }),
  )

export const layerFromConfig = (config?: string | Config.Config<string>) =>
  Effect.map(Config.isConfig(config) ? config : Config.string(config), layer).pipe(Layer.unwrap)

export const withHeaders = (settlement: SettleResponse) =>
  HttpServerResponse.setHeader(PAYMENT_RESPONSE, S.encodeSync(SettleResponseFromBase64JsonString)(settlement))
