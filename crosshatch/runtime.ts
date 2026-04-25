import { memoMap, runtime } from "@crosshatch/util/runtime"
import { Layer, ManagedRuntime } from "effect"
import { Client } from "liminal/actor"
import { boundLayer } from "liminal/util/boundLayer"

import * as Facade from "./Facade/Facade.ts"
import { InternalEnv } from "./InternalEnv.ts"

const CommonLive = Facade.FacadeState.layer.pipe(
  Layer.provideMerge(
    Client.layerWorker({
      client: Facade.FacadeClient,
    }).pipe(Layer.provide(Facade.FacadeWorker.layer)),
  ),
  Layer.provideMerge(InternalEnv.layer),
  boundLayer("crosshatch"),
)

export const atomRuntime = runtime(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, { memoMap })
