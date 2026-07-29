import { Accept, Known, Payer } from "crosshatch"
import { HostMnemonic } from "crosshatch/Host"
import { UnifiedSchemes } from "crosshatch/Unified"
import { Layer } from "effect"

export const PayerLive = Payer.layerLocal({
  accept: Accept.first(Known),
  schemes: UnifiedSchemes.layer.pipe(Layer.provide(HostMnemonic.layer())),
})
