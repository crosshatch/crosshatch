import { annotateLogsLayer } from "@crosshatch/util/annotateLogsLayer"
import { memoMap, runtime } from "@crosshatch/util/runtime"
import { Layer, ManagedRuntime, Effect, References } from "effect"
import { Client } from "liminal"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { FacadeClient } from "./FacadeClient.ts"
import * as Accumulator from "./FacadeState.ts"
import * as FacadeWorker from "./FacadeWorker.ts"

const CommonLive = Accumulator.layer.pipe(
  Layer.provideMerge(Client.layerWorker({ client: FacadeClient }).pipe(Layer.provide(FacadeWorker.layer))),
  Layer.provideMerge(CrosshatchEnv.layer),
  Layer.tapError(Effect.logError),
  annotateLogsLayer({ context: "crosshatch" }),
  Layer.provideMerge(Layer.succeed(References.MinimumLogLevel, "All")),
)

export const atomRuntime = runtime(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, { memoMap })
