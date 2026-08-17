import { Accept, Payer, Mnemonic } from "crosshatch"
import * as Known from "crosshatch/Known"
import { UnifiedSchemes } from "crosshatch/Unified"
import { Config, Layer } from "effect"

export const layerPrelude = Payer.layerLocal(Accept.first(Known)).pipe(
  Layer.provide(
    UnifiedSchemes.layer({
      solana: {
        rpc: Config.string("SOLANA_RPC_URL").pipe(Config.withDefault(undefined)),
      },
    }).pipe(Layer.provide(Mnemonic.layerFromEnv)),
  ),
)
