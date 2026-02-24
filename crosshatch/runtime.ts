import { memoMap, runtime } from "@crosshatch/util/memoMap"
import { resolveEnv } from "@crosshatch/util/resolveEnv"
import { ConfigProvider, Layer, ManagedRuntime } from "effect"

import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { FacadeClient } from "./FacadeClient.ts"

const CommonLive = Layer.mergeAll(FacadeClient.layer, CrosshatchEnv.layer).pipe(
  Layer.provide(Layer.setConfigProvider(ConfigProvider.fromJson(resolveEnv()))),
)
export const atomRuntime = runtime(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, memoMap)
