import { prefixLookup } from "@crosshatch/util/prefix"

export const ContextKeys = prefixLookup("crosshatch", {
  BridgeClient: true,
  CrosshatchEnv: true,
  PublicClient: true,
})
