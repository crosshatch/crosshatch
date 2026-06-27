import { Effect, Layer, ManagedRuntime } from "effect"
import { FetchHttpClient } from "effect/unstable/http"
import { OtlpSerialization, OtlpLogger, OtlpTracer } from "effect/unstable/observability"
import { Atom } from "effect/unstable/reactivity"
import * as Boundary from "liminal-util/Boundary"

import { Stage } from "../Stage.ts"
import * as BrowserPayer from "./BrowserPayer.ts"

const OtlpLive = Stage.pipe(
  Effect.map(({ name, url }) =>
    name === "prod"
      ? Layer.empty
      : Layer.mergeAll(
          OtlpLogger.layer({
            url: url("otel/v1/logs"),
            resource: { serviceName: "crosshatch-lib" },
          }),
          OtlpTracer.layer({
            url: url("otel/v1/traces"),
            resource: { serviceName: "crosshatch-lib" },
          }),
        ).pipe(Layer.provide(OtlpSerialization.layerJson)),
  ),
  Layer.unwrap,
)

const Live = Layer.mergeAll(BrowserPayer.layer, OtlpLive.pipe(Layer.provideMerge(FetchHttpClient.layer))).pipe(
  Boundary.layer("crosshatch", import.meta.url),
)

export const memoMap = Layer.makeMemoMapUnsafe()
export const atomRuntime = Atom.context({ memoMap })(Live)
export const managedRuntime = ManagedRuntime.make(Live, { memoMap })

export const CrosshatchLive = Effect.gen(function* () {
  const context = yield* managedRuntime.contextEffect
  return Layer.succeedContext(context)
}).pipe(Layer.unwrap)
