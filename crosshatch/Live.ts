import { managedLive } from "@crosshatch/util"
import { BridgeClient } from "./BridgeClient.ts"

export const { runtime, Live } = managedLive("kit/runtime", BridgeClient.Default)
