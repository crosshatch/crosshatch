import { KnownAssets, Payer, AssetConfiguration } from "crosshatch"
import { EvmAdapter } from "crosshatch/Evm"
import { Layer } from "effect"

export const PayerLive = Payer.layer.pipe(
  Layer.provide([EvmAdapter.layerMnemonicEnv, AssetConfiguration.layer(KnownAssets)]),
)
