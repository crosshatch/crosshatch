import { Layer } from "effect"
import { EnclaveProxyClient } from "./EnclaveClient.ts"

export const Live = Layer.mergeAll(
  EnclaveProxyClient.Default,
)
