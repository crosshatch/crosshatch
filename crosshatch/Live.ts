import { Layer } from "effect"
import { EnclaveClient } from "./EnclaveClient.ts"

export const Live = Layer.mergeAll(
  EnclaveClient.Default,
)
