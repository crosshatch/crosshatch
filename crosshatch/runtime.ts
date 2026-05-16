import { Effect, Layer, ManagedRuntime } from "effect"
import { OtlpLogger, OtlpSerialization, OtlpTracer } from "effect/unstable/observability"
import { Atom } from "effect/unstable/reactivity"
import { Client } from "liminal"
import { boundLayer } from "liminal-util/boundLayer"

import * as Facade from "./Facade/Facade.ts"
import { CrosshatchHttpClient } from "./http.ts"
import { InternalEnv } from "./InternalEnv.ts"

const OtlpLive = InternalEnv.asEffect().pipe(
  Effect.map(({ dev }) =>
    dev
      ? Layer.mergeAll(
          OtlpTracer.layer({
            url: "/v1/traces",
            resource: { serviceName: "crosshatch-lib" },
          }),
          OtlpLogger.layer({
            url: "/v1/logs",
            resource: { serviceName: "crosshatch-lib" },
          }),
        ).pipe(Layer.provide(OtlpSerialization.layerJson))
      : Layer.empty,
  ),
  Layer.unwrap,
)

const CommonLive = Client.layerWorker({
  client: Facade.FacadeClient,
  reducers: Facade.reducers,
}).pipe(
  Layer.provide(Facade.FacadeWorker.layer),
  Layer.provideMerge(InternalEnv.layer),
  Layer.provideMerge(OtlpLive.pipe(Layer.provide(InternalEnv.layer), Layer.provideMerge(CrosshatchHttpClient))),
  boundLayer("crosshatch"),
)

export const memoMap = Layer.makeMemoMapUnsafe()
export const atomRuntime = Atom.context({ memoMap })(CommonLive)
export const managedRuntime = ManagedRuntime.make(CommonLive, { memoMap })

export const CrosshatchLive = Effect.gen(function* () {
  const context = yield* managedRuntime.contextEffect
  return Layer.succeedContext(context)
}).pipe(Layer.unwrap)
