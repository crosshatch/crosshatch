import { memoMap, runtime } from "@crosshatch/util/memoMap"
import { Layer, ManagedRuntime } from "effect"

import { BridgeClient } from "./BridgeClient.ts"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"

const CommonLive = Layer.mergeAll(BridgeClient.layer, CrosshatchEnv.layer)
export const atomRuntime = runtime(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, memoMap)
