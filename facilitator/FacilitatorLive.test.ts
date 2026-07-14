import { env } from "node:process"

import { CredentialsFromEnv } from "@distilled.cloud/coinbase"
import { NodeHttpClient, NodeHttpServer } from "@effect/platform-node"
import { describe, it, assert } from "@effect/vitest"
import { Requirements, Facilitator, KnownAssets, Payload, Required, Payer, Mnemonic, Accept } from "crosshatch"
import { Eip155Address, Eip155Signer, Erc3009Scheme } from "crosshatch/Eip155"
import { Effect, Layer, Config } from "effect"
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
          Accept.layer(KnownAssets.Usd).pipe(
            Layer.provide(
              Erc3009Scheme.layer.pipe(
                Layer.provide(Eip155Signer.layerMnemonic.pipe(Layer.provide(Mnemonic.layerEnv))),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
)

describe.skipIf(!env.TEST_LIVE)(import.meta.url, () => {
  it.effect(
    "verifies and settles a freshly signed EIP155 x402 payment",
    Effect.fn(function* () {
      const required = yield* Required.make().pipe(
        Required.accept(
          Requirements.denomination(KnownAssets.Usd, {
            amount: 0.01,
            recipients: {
              eip155: {
                8453: yield* Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155"),
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
