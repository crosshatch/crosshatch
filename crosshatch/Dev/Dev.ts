import { createServer } from "node:http"

import { NodeHttpServer } from "@effect/platform-node"
import { Context, Effect, Layer, UndefinedOr } from "effect"
import { HttpRouter, HttpServer, HttpServerResponse } from "effect/unstable/http"
import { HttpApiBuilder, HttpApiScalar } from "effect/unstable/httpapi"
import { OtlpLogger, OtlpSerialization, OtlpTracer } from "effect/unstable/observability"

import { FacilitatorApi } from "../FacilitatorApi/FacilitatorApi.ts"
import * as PackageJson from "../package.json" with { type: "json" }
import { settle } from "./settle.ts"
import { supported } from "./supported.ts"
import { verify } from "./verify.ts"

export interface DevConfig {
  readonly hostname?: string | undefined
  readonly port?: number | undefined
  readonly otelEndpoint?: string | undefined
}

export const serve = Effect.fnUntraced(function* (config?: DevConfig) {
  const context = yield* HttpRouter.serve(
    Layer.mergeAll(
      HttpApiScalar.layer(FacilitatorApi, { path: "/" }),
      Layer.mergeAll(
        HttpApiBuilder.layer(FacilitatorApi, { openapiPath: "/openapi.json" }).pipe(
          Layer.provide(
            HttpApiBuilder.group(FacilitatorApi, "facilitator", (_) => _.handleAll({ supported, verify, settle })),
          ),
        ),
        HttpRouter.add("GET", "/favicon.ico", () => Effect.succeed(HttpServerResponse.empty({ status: 204 }))).pipe(
          Layer.provide(HttpRouter.disableLogger),
        ),
      ).pipe(
        Layer.provide(
          UndefinedOr.match(config?.otelEndpoint, {
            onUndefined: () => Layer.empty,
            onDefined: (baseUrl) => {
              const resource = {
                serviceName: "crosshatch-dev",
                serviceVersion: PackageJson.version,
              }
              return Layer.mergeAll(
                OtlpLogger.layer({
                  url: `${baseUrl}/v1/logs`,
                  resource,
                }),
                OtlpTracer.layer({
                  url: `${baseUrl}/v1/traces`,
                  resource,
                }),
              ).pipe(Layer.provide(OtlpSerialization.layerJson))
            },
          }),
        ),
      ),
      HttpRouter.cors({
        allowedHeaders: ["*"],
        allowedMethods: ["*"],
        allowedOrigins: ["*"],
      }),
    ),
  ).pipe(
    Layer.provideMerge(
      NodeHttpServer.layer(createServer, {
        host: config?.hostname ?? "127.0.0.1",
        port: config?.port ?? 0,
      }),
    ),
    Layer.build,
  )
  const { address } = Context.get(context, HttpServer.HttpServer)
  const { hostname, port } = yield* Effect.succeed(address).pipe(
    Effect.filterOrElse((address) => address._tag === "TcpAddress", Effect.die),
  )
  return {
    hostname,
    port,
    url: `http://${hostname.includes(":") ? `[${hostname}]` : hostname}:${port}`,
  }
})
