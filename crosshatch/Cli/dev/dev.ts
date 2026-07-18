import { createServer } from "node:http"

import { NodeHttpServer } from "@effect/platform-node"
import { Config, Effect, Layer, Option, Schema } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"
import { HttpApiBuilder } from "effect/unstable/httpapi"
import { OtlpLogger, OtlpSerialization, OtlpTracer } from "effect/unstable/observability"

import { FacilitatorApi } from "../../FacilitatorApi/FacilitatorApi.ts"
import PackageJson from "../../package.json" with { type: "json" }
import { handleSettle } from "./handleSettle.ts"
import { handleSupported } from "./handleSupported.ts"
import { handleVerify } from "./handleVerify.ts"

export const DevFacilitatorLive = HttpApiBuilder.group(FacilitatorApi, "facilitator", (_) =>
  Effect.succeed(_.handle("settle", handleSettle).handle("verify", handleVerify).handle("supported", handleSupported)),
)

export const dev = Command.make("dev", {
  host: Flag.string("host").pipe(Flag.withDefault("127.0.0.1")),
  port: Flag.integer("port").pipe(Flag.withSchema(Config.Port), Flag.withDefault(4647)),
  otelEndpoint: Flag.string("otel-endpoint").pipe(
    Flag.withSchema(Schema.URLFromString),
    Flag.optional,
    Flag.withDescription("Export dev server logs and traces to an OTLP/HTTP endpoint"),
  ),
}).pipe(
  Command.withHandler(({ host, port, otelEndpoint }) => {
    const telemetry = Option.match(otelEndpoint, {
      onNone: () => Layer.empty,
      onSome: (endpoint) => {
        const baseUrl = endpoint.href.replace(/\/$/u, "")
        const resource = {
          serviceName: "crosshatch-dev-facilitator",
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
    })

    return HttpRouter.serve(
      Layer.mergeAll(
        HttpApiBuilder.layer(FacilitatorApi, { openapiPath: "/openapi.json" }).pipe(Layer.provide(DevFacilitatorLive)),
        HttpRouter.add("GET", "/health", () => Effect.succeed(HttpServerResponse.text("ok"))),
        HttpRouter.add("GET", "/favicon.ico", () => Effect.succeed(HttpServerResponse.empty({ status: 204 }))).pipe(
          Layer.provide(HttpRouter.disableLogger),
        ),
        HttpRouter.cors({
          allowedHeaders: ["*"],
          allowedMethods: ["*"],
          allowedOrigins: ["*"],
        }),
      ),
    ).pipe(Layer.provide(NodeHttpServer.layer(createServer, { host, port })), Layer.launch, Effect.provide(telemetry))
  }),
)
