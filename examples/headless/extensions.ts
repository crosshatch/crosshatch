import {
  KnownAssets,
  Facilitator,
  Required,
  Requirements,
  Payload,
  Extension,
  PaymentId,
  PaymentIdExtension,
} from "crosshatch"
import { EvmAddress } from "crosshatch/Evm"
import { Effect, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import { PayerLive } from "./_common.ts"

// Merchants make the required with extension info.
const makeRequired = Effect.gen(function* () {
  const EVM_ADDRESS = yield* EvmAddress.config("PAY_TO_EVM")
  return yield* Required.make`
  |
  | Description of the charge.
  |
  `.pipe(
    Required.extend(PaymentIdExtension, {
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
          PaymentIdExtension,
          Effect.fn(function* ({ required }) {
            return {
              required,
              id: PaymentId.make(crypto.randomUUID()),
            }
          }),
        ),
      ),
    ),
  ]),
  Effect.runFork,
)
