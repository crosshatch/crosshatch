import { Accept, Known, Payer } from "crosshatch"
import { DefaultSchemes } from "crosshatch/Defaults"
import { HostMnemonic } from "crosshatch/Host"
import { Layer } from "effect"

export const PayerLive = Payer.layerLocal({
  accept: Accept.first(Known),
  schemes: DefaultSchemes.layer.pipe(Layer.provide(HostMnemonic.layer())),
})
