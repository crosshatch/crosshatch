import { Config, Layer } from "effect"

import * as Accept from "./Accept.ts"
import { Erc3009Scheme, Eip155Signer, Permit2Scheme } from "./Eip155/Eip155.ts"
import * as Known from "./Known/Known.ts"
import * as Payer from "./Payer.ts"
import { SolanaState, SolanaScheme, SolanaSigner } from "./Solana/Solana.ts"

// Solana's signing does require the latest blockhash in order to restrict ttl.
const SolanaStateLive = Config.string("SOLANA_RPC_URL").pipe(Config.map(SolanaState.layer), Layer.unwrap)

export const layer = Payer.layerLocal({
  assets: Known.USD,
  accept: Accept.firstKnown,
  schemes: Layer.mergeAll(
    Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(Layer.provide(Eip155Signer.layerMnemonic)),
    SolanaScheme.layer.pipe(Layer.provide([SolanaSigner.layerMnemonic, SolanaStateLive])),
  ),
})
