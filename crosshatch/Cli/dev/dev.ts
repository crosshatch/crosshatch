import { createServer } from "node:http"

import { NodeHttpServer } from "@effect/platform-node"
import { Config, Effect, Layer } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"
import { HttpApiBuilder } from "effect/unstable/httpapi"

import { FacilitatorApi } from "../../FacilitatorApi/FacilitatorApi.ts"
import { handleSettle } from "./handleSettle.ts"
import { handleSupported } from "./handleSupported.ts"
import { handleVerify } from "./handleVerify.ts"

export const DevFacilitatorLive = HttpApiBuilder.group(FacilitatorApi, "facilitator", (_) =>
  Effect.succeed(_.handle("settle", handleSettle).handle("verify", handleVerify).handle("supported", handleSupported)),
)

export const dev = Command.make("dev", {
  port: Flag.integer("port").pipe(Flag.withSchema(Config.Port), Flag.withDefault(4647)),
  host: Flag.string("host").pipe(Flag.withDefault("127.0.0.1")),
}).pipe(
  Command.withHandler(({ host, port }) =>
    HttpRouter.serve(
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
    ).pipe(Layer.provide(NodeHttpServer.layer(createServer, { host, port })), Layer.launch),
  ),
)
