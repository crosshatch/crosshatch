import { Effect, GlobalValue, Layer, ManagedRuntime } from "effect"
import { prefix } from "./prefix.ts"

export const managedLive = <ROut, E>(
  key: string,
  layer: Layer.Layer<ROut, E>,
) => {
  const runtime = GlobalValue.globalValue(
    prefix(key),
    () => ManagedRuntime.make(layer),
  )
  const Live = Layer.effectContext(
    runtime.runtimeEffect.pipe(
      Effect.map((v) => v.context),
    ),
  )
  return { runtime, Live }
}
