import { CredentialsFromEnv } from "@distilled.cloud/coinbase"
import { NodeHttpClient, NodeHttpServer } from "@effect/platform-node"
import { describe, it, assert } from "@effect/vitest"
import { Requirements, Facilitator } from "crosshatch"
import { EvmChain, EvmAddress } from "crosshatch/Evm"
import { USDC } from "crosshatch/KnownAsset"
import { Config, Effect, Layer } from "effect"
import { HttpRouter } from "effect/unstable/http"
import { HttpApiBuilder, HttpApiClient } from "effect/unstable/httpapi"

import { FacilitatorLive } from "./FacilitatorLive/FacilitatorLive.ts"

const Live = HttpRouter.serve(
  HttpApiBuilder.layer(Facilitator.FacilitatorApi).pipe(Layer.provide(FacilitatorLive)),
).pipe(
  Layer.provide(NodeHttpClient.layerFetch),
  Layer.provideMerge(Layer.mergeAll(NodeHttpServer.layerTest, CredentialsFromEnv)),
)

describe(import.meta.url, () => {
  it.effect(
    "verifies and settles a freshly signed EVM x402 payment",
    Effect.fn(function* () {
      const seed = yield* Config.redacted("EVM_SEED_PHRASE")
      const paymentRequirements = Requirements.group(USDC, {
        amount: 0.01,
        recipients: {
          eip155: {
            8453: yield* EvmAddress.config("PAY_TO_EVM"),
          },
        },
      })[0]!
      const chain = EvmChain.fromMnemonic(seed)
      const { payload: paymentPayload } = yield* chain.createPayload({
        accepted: paymentRequirements,
      })
      const client = yield* HttpApiClient.make(Facilitator.FacilitatorApi)
      const verified = yield* client.facilitator.verify({
        payload: { paymentRequirements, paymentPayload },
      })
      assert(verified.isValid)
      const settled = yield* client.facilitator.settle({
        payload: { paymentRequirements, paymentPayload },
      })
      assert(settled.success)
    }, Effect.provide(Live)),
  )
})
