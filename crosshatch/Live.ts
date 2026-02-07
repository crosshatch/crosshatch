import { managedLive } from "@crosshatch/util/managedLive"
import { BridgeClient } from "./BridgeClient.ts"

export const { runtime, Live } = managedLive("kit/runtime", BridgeClient.Default)
