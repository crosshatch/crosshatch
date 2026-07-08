import { KnownAssets, Facilitator, Required, Requirements, Payload, Payer, AssetConfiguration } from "crosshatch"
import { EvmAdapter, EvmAddress } from "crosshatch/Evm"
import { Effect, Layer } from "effect"

Effect.gen(function* () {
  const EVM_ADDRESS = yield* EvmAddress.config("PAY_TO_EVM")
  const required = yield* Required.make`
  |
  | Description of the charge.
  |
  `.pipe(
    Required.accept(
      Requirements.asset(KnownAssets.USDC, {
        amount: 0.01,
        recipients: { eip155: { 8453: EVM_ADDRESS } },
        ttl: "1 minutes",
      }),
    ),
  )
  const { payload } = yield* Payload.make({ required })
  yield* Facilitator.settle({ payload })
}).pipe(
  Effect.provide(Payer.layer.pipe(Layer.provide([EvmAdapter.layerMnemonicEnv, AssetConfiguration.layer(KnownAssets)]))),
  Effect.runFork,
)
