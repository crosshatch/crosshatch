import { managedLive } from "@crosshatch/util/managedLive"
import { Layer } from "effect"
import { BridgeClient } from "./BridgeClient.ts"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"

export const Live = managedLive(
  "kit/runtime",
  BridgeClient.Default.pipe(
    Layer.provideMerge(CrosshatchEnv.layer),
  ),
)
