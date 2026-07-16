import { createServer } from "node:http"

import { NodeHttpServer } from "@effect/platform-node"
import { Facilitator } from "crosshatch"
import { Console, Effect, Layer } from "effect"
import { Command, Flag } from "effect/unstable/cli"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"
import { HttpApiBuilder } from "effect/unstable/httpapi"

import { handleSettle } from "./handleSettle.ts"
import { handleSupported } from "./handleSupported.ts"
import { handleVerify } from "./handleVerify.ts"

export const DevFacilitatorLive = HttpApiBuilder.group(Facilitator.FacilitatorApi, "facilitator", (_) =>
  Effect.succeed(_.handle("settle", handleSettle).handle("verify", handleVerify).handle("supported", handleSupported)),
)

export const dev = Command.make("dev", {
  port: Flag.integer("port").pipe(Flag.withDefault(4647)),
  host: Flag.string("host").pipe(Flag.withDefault("127.0.0.1")),
}).pipe(
  Command.withHandler(({ host, port }) =>
    HttpRouter.serve(
      Layer.mergeAll(
        HttpApiBuilder.layer(Facilitator.FacilitatorApi, { openapiPath: "/openapi.json" }).pipe(
          Layer.provide(DevFacilitatorLive),
        ),
        HttpRouter.add("GET", "/health", () => Effect.succeed(HttpServerResponse.text("ok"))),
      ),
    ).pipe(
      Layer.provide(
        HttpRouter.cors({
          allowedHeaders: ["*"],
          allowedMethods: ["*"],
          allowedOrigins: ["*"],
        }),
      ),
      Layer.provide(NodeHttpServer.layer(createServer, { host, port })),
      Layer.tap(() => Console.log(`Facilitator listening at http://${host}:${port}`)),
      Layer.launch,
    ),
  ),
)
