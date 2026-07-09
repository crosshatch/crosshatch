import { CredentialsFromEnv } from "@distilled.cloud/coinbase"
import { NodeHttpClient, NodeHttpServer } from "@effect/platform-node"
import { describe, it, assert } from "@effect/vitest"
import { Requirements, Facilitator, KnownAssets, Payload, Required, Payer, Mnemonic, Accept } from "crosshatch"
import { EvmAddress, EvmSigner, Erc3009 } from "crosshatch/Evm"
import { Effect, Layer } from "effect"
import { HttpRouter } from "effect/unstable/http"
import { HttpApiBuilder, HttpApiClient } from "effect/unstable/httpapi"

import { FacilitatorLive } from "./FacilitatorLive/FacilitatorLive.ts"

const Live = HttpRouter.serve(
  HttpApiBuilder.layer(Facilitator.FacilitatorApi).pipe(Layer.provide(FacilitatorLive)),
).pipe(
  Layer.provide(NodeHttpClient.layerFetch),
  Layer.provideMerge(
    Layer.mergeAll(
      NodeHttpServer.layerTest,
      CredentialsFromEnv,
      Payer.layer.pipe(
        Layer.provide(
          Accept.layer(KnownAssets).pipe(
            Layer.provide(Erc3009.layer.pipe(Layer.provide(Mnemonic.toLayerEnv(EvmSigner)))),
          ),
        ),
      ),
    ),
  ),
)

describe(import.meta.url, () => {
  it.effect(
    "verifies and settles a freshly signed EVM x402 payment",
    Effect.fn(function* () {
      const required = yield* Required.make().pipe(
        Required.accept(
          Requirements.asset(KnownAssets.USDC, {
            amount: 0.01,
            recipients: {
              eip155: {
                8453: yield* EvmAddress.config("PAY_TO_EVM"),
              },
            },
          }),
        ),
      )
      const { payload: paymentPayload } = yield* Payload.make({ required })
      const { accepted: paymentRequirements } = paymentPayload
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
