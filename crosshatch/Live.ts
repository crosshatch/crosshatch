import { Layer } from "effect"
import { BridgeClient } from "./BridgeClient.ts"

export const Live = Layer.mergeAll(
  BridgeClient.Default,
)
