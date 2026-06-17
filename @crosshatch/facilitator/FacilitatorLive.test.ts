import { NodeHttpServer } from "@effect/platform-node"
import { assert, describe, it } from "@effect/vitest"
import { ASSETS } from "../assets/ASSETS.ts"
import { FacilitatorApi, Payload } from "@crosshatch/x402"
import { CredentialsFromEnv } from "@distilled.cloud/coinbase"
import { Config, Effect, Layer } from "effect"
import { mnemonicToAccount } from "viem/accounts"
import { HttpRouter } from "effect/unstable/http"
import { HttpApiBuilder, HttpApiClient } from "effect/unstable/httpapi"

import { FacilitatorLive } from "./FacilitatorLive/FacilitatorLive.ts"

const ApiLive = HttpRouter.serve(
  HttpApiBuilder.layer(FacilitatorApi).pipe(Layer.provide(FacilitatorLive), Layer.provide(CredentialsFromEnv)),
  { disableListenLog: true, disableLogger: true },
).pipe(Layer.provideMerge(NodeHttpServer.layerTest))

describe(import.meta.url, () => {
  it.effect(
    "verifies and settles a freshly signed EVM x402 payment",
    () => Effect.gen(function* () {
      yield* Effect.log("creating x402 signer")
      const account = mnemonicToAccount(yield* Config.string("EVM_SEED_PHRASE"))
      const asset = ASSETS.BASE_SEPOLIA_USDC
      const paymentRequirements = {
        amount: "1",
        asset: asset.address,
        extra: {
          name: asset.name,
          version: asset.version,
        },
        maxTimeoutSeconds: 300,
        network: asset.chainId,
        payTo: account.address,
        scheme: "exact",
      } as const

      yield* Effect.log("creating x402 payment payload")
      const paymentPayload = yield* Payload.make(account, paymentRequirements)
      yield* Effect.log("creating facilitator client")
      const client = yield* HttpApiClient.make(FacilitatorApi)

      yield* Effect.log("verifying x402 payment")
      const verified = yield* client.facilitator.verify({ payload: { paymentPayload, paymentRequirements } })
      assert.deepInclude(verified, { isValid: true })

      yield* Effect.log("settling x402 payment")
      const settled = yield* client.facilitator.settle({ payload: { paymentPayload, paymentRequirements } })
      assert.deepInclude(settled, { success: true, network: asset.chainId })
    }).pipe(Effect.provide(ApiLive)),
    { timeout: 180_000 },
  )
})
