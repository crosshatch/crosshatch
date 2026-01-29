import { prefix } from "@crosshatch/util"
import { Effect, GlobalValue, Layer, ManagedRuntime } from "effect"
import { BridgeClient } from "./BridgeClient.ts"

export const runtime = GlobalValue.globalValue(
  prefix("kit/memo"),
  () => ManagedRuntime.make(BridgeClient.Default),
)

export const BridgeClientLive = Layer.effectContext(
  runtime.runtimeEffect.pipe(
    Effect.map((v) => v.context),
  ),
)
