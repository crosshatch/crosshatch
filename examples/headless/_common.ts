import { Accept, KnownAssets, Mnemonic, Payer } from "crosshatch"
import { Erc3009, Eip155Signer, Permit2 } from "crosshatch/Eip155"
import { Layer } from "effect"

export const PayerLive = Payer.layer.pipe(
  Layer.provide(
    Accept.layer(KnownAssets).pipe(
      Layer.provide(
        Layer.mergeAll(Erc3009.layer, Permit2.layer).pipe(Layer.provide(Mnemonic.toLayerEnv(Eip155Signer))),
      ),
    ),
  ),
)
