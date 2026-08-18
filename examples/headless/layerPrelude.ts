import { Accept, Payer, Mnemonic } from "crosshatch"
import * as Known from "crosshatch/Known"
import { SolanaState } from "crosshatch/Solana"
import { UnifiedSchemes } from "crosshatch/Unified"
import { Config, Effect, Layer } from "effect"

export const layerPrelude = Payer.layerLocal(Accept.first(Known)).pipe(
  Layer.provide(
    UnifiedSchemes.layer.pipe(
      Layer.provide([
        Config.string("SOLANA_RPC_URL").pipe(Effect.map(SolanaState.layer), Layer.unwrap),
        Mnemonic.layerFromEnv,
      ]),
    ),
  ),
)
