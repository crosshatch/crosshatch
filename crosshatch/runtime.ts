import { CrosshatchEnv } from "@crosshatch/util/CrosshatchEnv"
import { Effect, Layer, ManagedRuntime } from "effect"
import { FetchHttpClient } from "effect/unstable/http"
import { OtlpSerialization, Otlp } from "effect/unstable/observability"
import { Atom } from "effect/unstable/reactivity"
import { Client } from "liminal"
import * as Boundary from "liminal-util/Boundary"

import * as Facade from "./Facade/Facade.ts"

const OtlpLive = CrosshatchEnv.pipe(
  Effect.map(({ dev, domain }) =>
    dev
      ? Otlp.layer({
          baseUrl: domain,
          resource: { serviceName: "crosshatch-lib" },
        }).pipe(Layer.provide(OtlpSerialization.layerJson))
      : Layer.empty,
  ),
  Layer.unwrap,
)

const FacadeLive = Client.layerWorker({
  client: Facade.FacadeClient,
  reducers: Facade.reducers,
}).pipe(Layer.provide(Facade.FacadeWorker.layer))

const Live = FacadeLive.pipe(
  Layer.provideMerge(OtlpLive.pipe(Layer.provideMerge(Layer.mergeAll(CrosshatchEnv.layer, FetchHttpClient.layer)))),
  Boundary.layer("crosshatch", import.meta.url),
)

export const memoMap = Layer.makeMemoMapUnsafe()
export const atomRuntime = Atom.context({ memoMap })(Live)
export const managedRuntime = ManagedRuntime.make(Live, { memoMap })

export const CrosshatchLive = Effect.gen(function* () {
  const context = yield* managedRuntime.contextEffect
  return Layer.succeedContext(context)
}).pipe(Layer.unwrap)
