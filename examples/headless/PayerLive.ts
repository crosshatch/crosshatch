import { Accept, KnownAssets, Mnemonic, Payer } from "crosshatch"
import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "crosshatch/Eip155"
import { SolanaState, SolanaScheme, SolanaSigner } from "crosshatch/Solana"
import { Config, Layer } from "effect"

// Solana signing needs the latest blockhash to bound ttl.
const SolanaStateLive = Config.string("SOLANA_RPC_URL").pipe(Config.map(SolanaState.layer), Layer.unwrap)

const SchemesLive = Layer.mergeAll(
  Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(Layer.provideMerge(Eip155Signer.layerMnemonic)),
  SolanaScheme.layer.pipe(Layer.provideMerge([SolanaSigner.layerMnemonic, SolanaStateLive])),
).pipe(Layer.provideMerge(Mnemonic.layerEnv))

const AcceptLive = Accept.layer(KnownAssets.Usd).pipe(Layer.provideMerge(SchemesLive))

export const PayerLive = Payer.layer.pipe(Layer.provideMerge(AcceptLive))
