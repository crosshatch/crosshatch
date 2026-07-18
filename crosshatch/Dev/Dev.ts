import { createServer } from "node:http"

import { NodeHttpServer } from "@effect/platform-node"
import { Context, Effect, Layer } from "effect"
import { HttpRouter, HttpServer, HttpServerResponse } from "effect/unstable/http"
import { HttpApiBuilder, HttpApiScalar } from "effect/unstable/httpapi"

import { FacilitatorApi } from "../FacilitatorApi/FacilitatorApi.ts"
import type { DevConfig } from "./DevConfig.ts"
import { handleSettle } from "./handleSettle.ts"
import { handleSupported } from "./handleSupported.ts"
import { handleVerify } from "./handleVerify.ts"
import * as Otel from "./Otel.ts"

export const DevFacilitatorLive = HttpApiBuilder.group(FacilitatorApi, "facilitator", (_) =>
  Effect.succeed(_.handle("settle", handleSettle).handle("verify", handleVerify).handle("supported", handleSupported)),
)

export const serve = Effect.fnUntraced(function* ({ otelEndpoint, ...config }: DevConfig) {
  const context = yield* HttpRouter.serve(
    Layer.mergeAll(
      HttpApiScalar.layer(FacilitatorApi, { path: "/" }),
      Layer.mergeAll(
        HttpApiBuilder.layer(FacilitatorApi, { openapiPath: "/openapi.json" }).pipe(Layer.provide(DevFacilitatorLive)),
        HttpRouter.add("GET", "/favicon.ico", () => Effect.succeed(HttpServerResponse.empty({ status: 204 }))).pipe(
          Layer.provide(HttpRouter.disableLogger),
        ),
      ).pipe(Layer.provide(Otel.layer(otelEndpoint))),
      HttpRouter.cors({
        allowedHeaders: ["*"],
        allowedMethods: ["*"],
        allowedOrigins: ["*"],
      }),
    ),
  ).pipe(Layer.provideMerge(NodeHttpServer.layer(createServer, config)), Layer.build)
  const { address } = Context.get(context, HttpServer.HttpServer)
  if (address._tag !== "TcpAddress") {
    return yield* Effect.interrupt
  }
  const { hostname: host, port } = address
  return { host, port }
})
