import { Layer, ManagedRuntime } from "effect"
import { Atom } from "effect/unstable/reactivity"
import { Client } from "liminal"
import { boundLayer } from "liminal-util/boundLayer"
import * as Facade from "./Facade/Facade.ts"
import { InternalEnv } from "./InternalEnv.ts"

const CommonLive = Client.layerWorker({
  client: Facade.FacadeClient,
  reducers: Facade.reducers,
}).pipe(Layer.provide(Facade.FacadeWorker.layer), Layer.provideMerge(InternalEnv.layer), boundLayer("crosshatch"))

export const memoMap = Layer.makeMemoMapUnsafe()
export const atomRuntime = Atom.context({ memoMap })(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, { memoMap })
