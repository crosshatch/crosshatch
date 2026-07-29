import { Accept, Known, Payer } from "crosshatch"
import { HostMnemonic } from "crosshatch/Host"
import { UnifiedSchemes } from "crosshatch/Unified"
import { Config, Layer } from "effect"

export const PayerLive = Payer.layerLocal({
  accept: Accept.first(Known),
  schemes: UnifiedSchemes.layer({
    solana: { rpc: Config.string("SOLANA_RPC_URL") },
  }).pipe(Layer.provide(HostMnemonic.layer())),
})
