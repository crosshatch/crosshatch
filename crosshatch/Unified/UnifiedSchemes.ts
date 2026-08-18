import { Layer } from "effect"

import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "../Eip155/index.ts"
import { SolanaScheme, SolanaSigner } from "../Solana/index.ts"

export const layer = Layer.mergeAll(
  Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(Layer.provide(Eip155Signer.layerFromMnemonic)),
  SolanaScheme.layer.pipe(Layer.provide(SolanaSigner.layerFromMnemonic)),
)
