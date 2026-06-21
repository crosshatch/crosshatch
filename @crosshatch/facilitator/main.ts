import { CredentialsFromEnv } from "@distilled.cloud/coinbase"
import { EXPOSED_HEADERS } from "crosshatch/Http402"
import { FacilitatorApi } from "crosshatch/X402"
import { Layer, Effect } from "effect"
import { Worker } from "effect-workerd"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { Otlp, OtlpSerialization } from "effect/unstable/observability"
import * as Boundary from "liminal-util/Boundary"

import { FacilitatorLive } from "./FacilitatorLive/FacilitatorLive.ts"

export default Worker.make({
  handler: Layer.mergeAll(
    HttpApiBuilder.layer(FacilitatorApi, { openapiPath: "/openapi.json" }),
    HttpRouter.add("GET", "/health", () => Effect.succeed(HttpServerResponse.text("ok"))),
  ).pipe(
    Layer.provide(
      FacilitatorLive.pipe(
        Layer.provide(
          HttpRouter.cors({
            allowedHeaders: ["*"],
            allowedMethods: ["*"],
            allowedOrigins: ["*"],
            exposedHeaders: EXPOSED_HEADERS,
          }),
        ),
      ),
    ),
    Boundary.layer("handler", import.meta.url),
    HttpRouter.toHttpEffect,
    Effect.flatten,
  ),
  prelude: Layer.mergeAll(
    CredentialsFromEnv,
    Otlp.layerFromConfig({
      resource: { serviceName: "@crosshatch/facilitator" },
    }).pipe(Layer.provide(OtlpSerialization.layerJson)),
  ),
})
