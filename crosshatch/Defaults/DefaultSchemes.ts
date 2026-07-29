import { Config, Layer } from "effect"

import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "../Eip155/Eip155.ts"
import { SolanaState, SolanaScheme, SolanaSigner } from "../Solana/Solana.ts"

export const Eip155SchemesLive = Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(
  Layer.provide(Eip155Signer.layerMnemonic),
)

export const SolanaSchemeLive = SolanaScheme.layer.pipe(
  Layer.provide([
    SolanaSigner.layerMnemonic,
    Config.string("SOLANA_RPC_URL").pipe(Config.map(SolanaState.layer), Layer.unwrap),
  ]),
)

export const layer = Layer.mergeAll(Eip155SchemesLive, SolanaSchemeLive)
