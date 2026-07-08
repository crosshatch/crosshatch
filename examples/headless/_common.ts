import { Accept, KnownAssets, Payer } from "crosshatch"
import { Erc3009, EvmSigner } from "crosshatch/Evm"
import { Layer } from "effect"

export const PayerLive = Payer.layer.pipe(
  Layer.provide(
    Accept.layer(KnownAssets).pipe(Layer.provide(Erc3009.layer.pipe(Layer.provide(EvmSigner.layerMnemonicEnv)))),
  ),
)
