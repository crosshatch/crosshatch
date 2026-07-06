import { Mnemonic, KnownAssets, Payer, AssetConfiguration } from "crosshatch"
import { EvmChain } from "crosshatch/Evm"
import { Effect, flow, Layer } from "effect"

export const PayerLive = Mnemonic.config("MNEMONIC").pipe(
  Effect.map(flow(EvmChain.fromMnemonic, Payer.layer)),
  Layer.unwrap,
  Layer.provide(AssetConfiguration.layer(KnownAssets)),
)
