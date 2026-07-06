import { KnownAssets, Facilitator, Required, Requirements, Payload, Extension, PaymentId } from "crosshatch"
import { EvmAddress } from "crosshatch/Evm"
import { Effect, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import { PayerLive } from "./_common.ts"

const PaymentIdHandlerLive = Extension.layerHandler(
  PaymentId.PaymentIdExtension,
  Effect.fn(function* ({ required }) {
    return {
      required,
      id: PaymentId.PaymentId.make(crypto.randomUUID()),
    }
  }),
)

Effect.gen(function* () {
  const EVM_ADDRESS = yield* EvmAddress.config("PAY_TO_EVM")
  const required = yield* Required.make`
  |
  | Description of the charge.
  |
  `.pipe(
    Required.extend(PaymentId.PaymentIdExtension, {
      required: true,
    }),
    Required.accept(
      Requirements.group(KnownAssets.USDC, {
        amount: 0.01,
        recipients: { eip155: { 8453: EVM_ADDRESS } },
        ttl: "1 minutes",
      }),
    ),
  )
  const { payload } = yield* Payload.make({ required })
  yield* Facilitator.settle({ payload })
}).pipe(Effect.provide([FetchHttpClient.layer, PayerLive.pipe(Layer.provide(PaymentIdHandlerLive))]), Effect.runFork)
