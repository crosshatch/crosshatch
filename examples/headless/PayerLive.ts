import { NodeServices } from "@effect/platform-node"
import * as DefaultPayer from "crosshatch/DefaultPayer"
import { HostMnemonic } from "crosshatch/Host"
import { Layer } from "effect"

export const PayerLive = DefaultPayer.layer.pipe(
  Layer.provide(HostMnemonic.layer().pipe(Layer.provide(NodeServices.layer))),
)
