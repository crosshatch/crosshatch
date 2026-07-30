import { NodeServices } from "@effect/platform-node"
import { Accept, Payer, MnemonicStore } from "crosshatch"
import * as ChxNodeServices from "crosshatch/ChxNodeServices"
import * as Known from "crosshatch/Known"
import { UnifiedSchemes } from "crosshatch/Unified"
import { Config, Layer } from "effect"

export const Prelude = Payer.layerLocal({
  accept: Accept.first(Known),
  schemes: UnifiedSchemes.layer({
    solana: { rpc: Config.string("SOLANA_RPC_URL").pipe(Config.withDefault(undefined)) },
  }).pipe(Layer.provide(MnemonicStore.layerMnemonicFromName().pipe(Layer.provide(ChxNodeServices.layer)))),
}).pipe(Layer.provideMerge(NodeServices.layer))
