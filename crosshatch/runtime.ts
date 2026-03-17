import { resolveEnv } from "@crosshatch/util/resolveEnv"
import { memoMap, runtime } from "@crosshatch/util/runtime"
import { ConfigProvider, Layer, ManagedRuntime } from "effect"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import * as Facade from "./Facade.ts"

const CommonLive = Layer.mergeAll(Facade.layer.pipe(Layer.provideMerge(CrosshatchEnv.layer))).pipe(
  Layer.provide(Layer.setConfigProvider(ConfigProvider.fromJson(resolveEnv()))),
)
export const atomRuntime = runtime(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, memoMap)
