import { Layer, ManagedRuntime } from "effect"
import { Client } from "liminal"
import { boundLayer } from "liminal-util/boundLayer"
import { Atom } from "effect/unstable/reactivity"
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

export const memoMap = Layer.makeMemoMapUnsafe()
export const atomRuntime = Atom.context({ memoMap })(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, { memoMap })
