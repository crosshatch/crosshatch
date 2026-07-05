import { Effect, Layer } from "effect"
import { Worker } from "effect-workerd"
import { OtlpProxy } from "effect-workerd/observability"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"
import { Otlp, OtlpSerialization } from "effect/unstable/observability"

import { ApiEnv } from "./ApiEnv.ts"

export default Worker.make({
  handler: Layer.mergeAll(
    OtlpProxy.layerFromConfig(),
    HttpRouter.add("GET", "/health", () => Effect.succeed(HttpServerResponse.text("ok"))),
  ).pipe(HttpRouter.toHttpEffect, Effect.flatten),
  prelude: Layer.mergeAll(
    Otlp.layerFromConfig({
      resource: { serviceName: "otel.crosshatch.dev" },
    }).pipe(Layer.provide(OtlpSerialization.layerJson)),
    ApiEnv.layer,
  ),
})
