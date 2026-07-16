import { KnownAssets, Facilitator, Required, Requirements, Payload, Extension } from "crosshatch"
import { Eip155Address } from "crosshatch/Eip155"
import { PaymentId } from "crosshatch/Extensions"
import { Config, Effect, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import { PayerLive } from "./PayerLive.ts"

// Merchants make the required with extension info.
const makeRequired = Effect.gen(function* () {
  const recipient = yield* Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")
  return yield* Required.make`
  |
  | Description of the charge.
  |
  `.pipe(
    Required.extend(PaymentId.FromClient, { required: true }),
    Required.accept(
      Requirements.denomination(KnownAssets.Usd, {
        amount: 0.01,
        recipients: { eip155: { 8453: recipient } },
        ttl: "1 minutes",
      }),
    ),
  )
})

// Clients provide extension-specific handlers to the payer layer.
Effect.gen(function* () {
  const required = yield* makeRequired
  const { payload } = yield* Payload.make({ required })
  yield* Facilitator.settle({ payload })
}).pipe(
  Effect.provide([
    FetchHttpClient.layer,
    PayerLive.pipe(
      Layer.provide(
        Extension.layerHandler(
          PaymentId.FromMerchant,
          Effect.fn(function* ({ required }) {
            return {
              required,
              id: PaymentId.random(),
            }
          }),
        ),
      ),
    ),
  ]),
  Effect.runFork,
)
