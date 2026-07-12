import { Accept, KnownAssets, Mnemonic, Payer } from "crosshatch"
import { Erc3009, Eip155Signer, Permit2 } from "crosshatch/Eip155"
import { GetLatestBlockhash, SolanaAdapter, SolanaSigner } from "crosshatch/Solana"
import { Config, Layer } from "effect"

export const PayerLive = Payer.layer.pipe(
  Layer.provide(
    Accept.layer(KnownAssets).pipe(
      Layer.provide(
        Layer.mergeAll(
          // EIP155 doesn't need the latest blockhash, so no RPC necessary.
          Layer.mergeAll(Erc3009.layer, Permit2.layer).pipe(Layer.provide(Eip155Signer.layerMnemonic)),
          // Solana's signing does require the latest blockhash.
          SolanaAdapter.layer.pipe(
            Layer.provide([
              SolanaSigner.layerMnemonic,
              Config.string("SOLANA_RPC_URL").pipe(Config.map(GetLatestBlockhash.layer), Layer.unwrap),
            ]),
          ),
        ).pipe(Layer.provide(Mnemonic.layerEnv)),
      ),
    ),
  ),
)
