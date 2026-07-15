import { CredentialsFromEnv } from "@distilled.cloud/coinbase"
import * as Cloudflare from "alchemy/Cloudflare"
import { Facilitator } from "crosshatch"
import { Config, Layer, Effect } from "effect"
import * as Path from "effect/Path"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"
import * as Etag from "effect/unstable/http/Etag"
import * as HttpPlatform from "effect/unstable/http/HttpPlatform"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { Otlp, OtlpSerialization } from "effect/unstable/observability"
import * as Boundary from "liminal-util/Boundary"

import { FacilitatorLive } from "./FacilitatorLive/FacilitatorLive.ts"

export default class FacilitatorWorker extends Cloudflare.Worker<FacilitatorWorker>()(
  "Facilitator",
  {
    main: new URL(import.meta.url).pathname,
    domain: "facilitator.crosshatch.dev",
    dev: {
      host: "127.0.0.1",
      port: 1337,
      strictPort: true,
    },
  },
  Effect.gen(function* () {
    yield* Config.string("CROSSHATCH_STAGE")
    yield* Config.string("CDP_API_KEY_ID")
    yield* Config.redacted("CDP_API_KEY_SECRET")
    yield* Config.string("OTEL_EXPORTER_OTLP_ENDPOINT")
    yield* Config.redacted("OTEL_EXPORTER_OTLP_HEADERS")

    const prelude = Layer.mergeAll(
      CredentialsFromEnv,
      Otlp.layerFromConfig({
        resource: { serviceName: "@crosshatch/facilitator" },
      }).pipe(Layer.provide(OtlpSerialization.layerJson)),
    )

    const handler = Layer.mergeAll(
      HttpApiBuilder.layer(Facilitator.FacilitatorApi, { openapiPath: "/openapi.json" }).pipe(
        Layer.provide(FacilitatorLive),
      ),
      HttpRouter.add("GET", "/health", () => Effect.succeed(HttpServerResponse.text("ok"))),
      FacilitatorLive,
    ).pipe(
      Layer.provide(
        HttpRouter.cors({
          allowedHeaders: ["*"],
          allowedMethods: ["*"],
          allowedOrigins: ["*"],
        }),
      ),
      Layer.provide([Etag.layer, HttpPlatformStub, Path.layer]),
      Boundary.layer("handler", import.meta.url),
      HttpRouter.toHttpEffect,
      Effect.map((fetch) => fetch.pipe(Effect.provide(prelude))),
    )

    return { fetch: handler }
  }),
) {}

const HttpPlatformStub = Layer.succeed(HttpPlatform.HttpPlatform, {
  fileResponse: () => Effect.die("HttpPlatform.fileResponse not supported"),
  fileWebResponse: () => Effect.die("HttpPlatform.fileWebResponse not supported"),
})
