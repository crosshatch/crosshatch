import {
  Mnemonic,
  KnownAssets,
  Facilitator,
  Payer,
  Required,
  Requirements,
  Payload,
  AssetConfiguration,
  Extension,
} from "crosshatch"
import { PaymentIdExtension } from "crosshatch/dist/PaymentId.d"
import { EvmChain, EvmAddress } from "crosshatch/Evm"
import { Effect, flow, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

Effect.gen(function* () {
  const EVM_ADDRESS = yield* EvmAddress.config("PAY_TO_EVM")
  const required = yield* Required.make`
  |
  | Description of the charge.
  |
  `.pipe(
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
}).pipe(
  Effect.provide([
    FetchHttpClient.layer,
    Mnemonic.config("MNEMONIC").pipe(
      Effect.map(flow(EvmChain.fromMnemonic, Payer.layer)),
      Layer.unwrap,
      Layer.provide(
        Extension.layerHandler(
          PaymentIdExtension,
          Effect.fn(function* ({ required, id }) {
            return { required, id }
          }),
        ),
      ),
      Layer.provide(AssetConfiguration.layer(KnownAssets)),
    ),
  ]),
  Effect.runFork,
)
