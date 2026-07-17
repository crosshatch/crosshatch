import { KnownAssets, Required, Requirements, Payload, FacilitatorClient } from "crosshatch"
import { Eip155Address } from "crosshatch/Eip155"
import { Config, Effect, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import { PayerLive } from "./PayerLive.ts"

Effect.gen(function* () {
  const recipient = yield* Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")
  const required = yield* Required.make`
  |
  | Description of the charge.
  |
  `.pipe(
    Required.accept(
      Requirements.denomination(KnownAssets.Usd, {
        amount: 0.01,
        recipients: { eip155: { 8453: recipient } },
        ttl: "1 minutes",
      }),
    ),
  )
  const { payload } = yield* Payload.make({ required })
  yield* FacilitatorClient.settle({ payload })
}).pipe(
  Effect.provide([FacilitatorClient.layerChx.pipe(Layer.provide(FetchHttpClient.layer)), PayerLive]),
  Effect.runFork,
)
