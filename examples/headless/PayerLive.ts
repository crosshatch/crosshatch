import { Accept, KnownAssets, Mnemonic, Payer } from "crosshatch"
import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "crosshatch/Eip155"
import { GetLatestBlockhash, SolanaScheme, SolanaSigner } from "crosshatch/Solana"
import { Config, Layer } from "effect"

export const PayerLive = Payer.layer.pipe(
  Layer.provide(
    Accept.layer(KnownAssets.Usd).pipe(
      Layer.provide(
        Layer.mergeAll(
          // EIP155 doesn't need the latest blockhash, so no RPC necessary.
          Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(Layer.provide(Eip155Signer.layerMnemonic)),
          // Solana's signing does require the latest blockhash.
          SolanaScheme.layer.pipe(
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
