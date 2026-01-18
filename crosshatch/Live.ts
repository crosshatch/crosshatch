import { Layer } from "effect"
import { BridgeClient } from "./EnclaveClient.ts"

export const Live = Layer.mergeAll(
  BridgeClient.Default,
)
