import * as Cloudflare from "alchemy/Cloudflare"
import { FacilitatorApi } from "crosshatch/FacilitatorApi"
import { Layer, Effect, FileSystem } from "effect"
import * as Path from "effect/Path"
import { HttpRouter, HttpServerResponse, HttpPlatform } from "effect/unstable/http"
import * as Etag from "effect/unstable/http/Etag"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { domain } from "liminal-util/alchemicals/WorkerConfig"

import { FacilitatorEnv } from "./FacilitatorEnv.ts"
import { FacilitatorLive } from "./FacilitatorLive/FacilitatorLive.ts"
import PackageJson from "./package.json" with { type: "json" }
import * as Prelude from "./Prelude.ts"

export default class FacilitatorWorker extends Cloudflare.Worker<FacilitatorWorker>()(
  "Facilitator",
  // @ts-ignore
  Effect.gen(function* () {
    return {
      main: import.meta.url,
      domain: yield* domain(PackageJson.name),
      observability: { enabled: true },
      placement: { mode: "smart" },
      compatibility: {
        date: "2026-02-05",
        flags: ["nodejs_compat", "global_fetch_strictly_public"],
      },
      dev: {
        host: "127.0.0.1",
        port: 4384,
        strictPort: true,
      },
    }
  }),
  Effect.gen(function* () {
    yield* FacilitatorEnv
    const fetch = Layer.mergeAll(
      HttpRouter.add("GET", "/health", () => Effect.succeed(HttpServerResponse.text("ok"))),
      HttpApiBuilder.layer(FacilitatorApi, { openapiPath: "/openapi.json" }).pipe(Layer.provide(FacilitatorLive)),
    ).pipe(
      Layer.provide([
        Etag.layer,
        Path.layer,
        HttpPlatform.layer.pipe(Layer.provideMerge(FileSystem.layerNoop({}))),
        HttpRouter.cors({
          allowedHeaders: ["*"],
          allowedMethods: ["*"],
          allowedOrigins: ["*"],
        }),
      ]),
      HttpRouter.toHttpEffect,
      Effect.scoped,
      Effect.flatten,
      Effect.provide(Prelude.layer.pipe(Layer.provideMerge(FacilitatorEnv.layer))),
      Effect.catchTag("ConfigError", Effect.die),
    )
    return { fetch }
  }).pipe(Effect.provide(FacilitatorEnv.layer)),
) {}
