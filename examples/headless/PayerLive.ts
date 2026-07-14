import { Accept, KnownAssets, Mnemonic, Payer } from "crosshatch"
import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "crosshatch/Eip155"
import { SolanaState, SolanaScheme, SolanaSigner } from "crosshatch/Solana"
import { Config, Layer } from "effect"

// Solana's signing does require the latest blockhash in order to restrict ttl.
const SolanaStateLive = Config.string("SOLANA_RPC_URL").pipe(Config.map(SolanaState.layer), Layer.unwrap)

export const PayerLive = Payer.layer.pipe(
  Layer.provide(
    Accept.layer(KnownAssets.Usd).pipe(
      Layer.provide(
        Layer.mergeAll(
          Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(Layer.provide(Eip155Signer.layerMnemonic)),
          SolanaScheme.layer.pipe(Layer.provide([SolanaSigner.layerMnemonic, SolanaStateLive])),
        ).pipe(Layer.provide(Mnemonic.layerEnv)),
      ),
    ),
  ),
)
