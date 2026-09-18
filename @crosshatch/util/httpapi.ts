import { Effect, Layer, Path, FileSystem } from "effect"
import { Etag, HttpPlatform, HttpRouter, HttpServerResponse } from "effect/unstable/http"

import { ChxDomain } from "./ChxDomain.ts"

export const layerApiCommon = Layer.mergeAll(
  ChxDomain.pipe(
    Effect.map(({ url }) =>
      HttpRouter.cors({
        allowedHeaders: ["*"],
        allowedMethods: ["*"],
        allowedOrigins: [url],
      }),
    ),
    Layer.unwrap,
  ),
  Etag.layer,
  Path.layer,
  HttpPlatform.layer.pipe(Layer.provideMerge(FileSystem.layerNoop({}))),
)

export const layerHealth = HttpRouter.add("GET", "/health", () => Effect.succeed(HttpServerResponse.text("ok")))
