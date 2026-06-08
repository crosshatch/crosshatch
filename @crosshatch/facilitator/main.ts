import { Layer, Effect } from "effect"
import { Worker } from "effect-workerd"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"
import { HttpApiBuilder } from "effect/unstable/httpapi"

import { Api } from "./Api.ts"
import { FacilitatorLive } from "./FacilitatorLive/FacilitatorLive.ts"

export default Worker.make({
  handler: Layer.mergeAll(
    HttpApiBuilder.layer(Api, { openapiPath: "/openapi.json" }),
    HttpRouter.add("GET", "/health", Effect.succeed(HttpServerResponse.text("ok"))),
  ).pipe(
    Layer.provide(
      FacilitatorLive.pipe(
        Layer.provide(
          HttpRouter.cors({
            allowedHeaders: ["*"],
            allowedMethods: ["*"],
            allowedOrigins: ["*"],
            exposedHeaders: ["PAYMENT-REQUIRED"],
          }),
        ),
      ),
    ),
    HttpRouter.toHttpEffect,
    Effect.flatten,
  ),
  prelude: Layer.empty,
})
