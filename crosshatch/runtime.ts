import { resolveEnv } from "@crosshatch/util/resolveEnv"
import { memoMap, runtime } from "@crosshatch/util/runtime"
import { ConfigProvider, Layer, ManagedRuntime } from "effect"
import { ActorClient } from "liminal"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { FacadeClient } from "./FacadeClient.ts"
import * as FacadeWorker from "./FacadeWorker.ts"

const CommonLive = Layer.mergeAll(
  ActorClient.layerWorker(FacadeClient).pipe(
    Layer.provide(FacadeWorker.layer),
    Layer.provideMerge(CrosshatchEnv.layer),
  ),
).pipe(Layer.provide(Layer.setConfigProvider(ConfigProvider.fromJson(resolveEnv()))))
export const atomRuntime = runtime(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, memoMap)
