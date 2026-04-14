import { withLogging } from "@crosshatch/util/LoggerLive"
import { memoMap, runtime } from "@crosshatch/util/runtime"
import { Layer, ManagedRuntime, Effect } from "effect"
import { Client } from "liminal"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { FacadeClient } from "./FacadeClient.ts"
import * as Accumulator from "./FacadeState.ts"
import * as FacadeWorker from "./FacadeWorker.ts"

const CommonLive = Accumulator.layer.pipe(
  Layer.provideMerge(Client.layerWorker({ client: FacadeClient }).pipe(Layer.provide(FacadeWorker.layer))),
  Layer.provideMerge(CrosshatchEnv.layer),
  Effect.succeed,
  Effect.annotateLogs("context", "crosshatch"),
  Layer.unwrap,
  withLogging,
)
export const atomRuntime = runtime(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, { memoMap })
