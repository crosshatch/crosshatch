import { withLogging } from "@crosshatch/util/LoggerLive"
import { resolveEnv } from "@crosshatch/util/resolveEnv"
import { memoMap, runtime } from "@crosshatch/util/runtime"
import { ConfigProvider, Layer, ManagedRuntime } from "effect"
import { Client } from "liminal"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { FacadeClient } from "./FacadeClient.ts"
import * as FacadeWorker from "./FacadeWorker.ts"

const CommonLive = Client.layerWorker({ client: FacadeClient }).pipe(
  Layer.provide(FacadeWorker.layer),
  Layer.provideMerge(CrosshatchEnv.layer),
  Layer.provide(Layer.setConfigProvider(ConfigProvider.fromJson(resolveEnv()))),
  withLogging,
)
export const atomRuntime = runtime(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, memoMap)
