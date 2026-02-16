import { prefixedKeys } from "@crosshatch/util/prefixedKeys"
import packageJson from "./package.json" with { type: "json" }

export const ContextKeys = prefixedKeys(packageJson.name, {
  BridgeClient: true,
  CrosshatchEnv: true,
})
