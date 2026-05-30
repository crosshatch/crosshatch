import { Effect, Layer, ManagedRuntime } from "effect"
import { FetchHttpClient } from "effect/unstable/http"
import { OtlpLogger, OtlpSerialization, OtlpTracer } from "effect/unstable/observability"
import { Atom } from "effect/unstable/reactivity"
import { Client } from "liminal"
import * as Boundary from "liminal-util/Boundary"

import { CrosshatchClient } from "./CrosshatchClient.ts"
import * as Facade from "./Facade/Facade.ts"
import { InternalEnv } from "./InternalEnv.ts"

const OtlpLive = InternalEnv.pipe(
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

const FacadeLive = Client.layerWorker({
  client: Facade.FacadeClient,
  reducers: Facade.reducers,
}).pipe(Layer.provide(Facade.FacadeWorker.layer))

const Live = FacadeLive.pipe(
  Layer.provideMerge(
    Layer.mergeAll(CrosshatchClient.layer, OtlpLive).pipe(
      Layer.provideMerge(Layer.mergeAll(InternalEnv.layer, FetchHttpClient.layer)),
    ),
  ),
  Boundary.layer("crosshatch", import.meta.url),
)

export const memoMap = Layer.makeMemoMapUnsafe()
export const atomRuntime = Atom.context({ memoMap })(Live)
export const managedRuntime = ManagedRuntime.make(Live, { memoMap })

export const CrosshatchLive = Effect.gen(function* () {
  const context = yield* managedRuntime.contextEffect
  return Layer.succeedContext(context)
}).pipe(Layer.unwrap)
