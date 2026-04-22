import { Layer, Effect } from "effect"
import { HttpRouter, HttpServer, HttpServerResponse } from "effect/unstable/http"
import { Assets, Worker } from "liminal-cloudflare/bindings"

import { OpenaiProxy } from "./OpenaiProxy.ts"

const ApiLive = Layer.mergeAll(
  HttpRouter.add("GET", "/", Effect.succeed(HttpServerResponse.text("ok"))),
  HttpRouter.use((router) => router.prefixed("/openai").add("*", "/*", OpenaiProxy)),
  HttpRouter.cors({
    allowedHeaders: ["*"],
    allowedMethods: ["*"],
    allowedOrigins: ["https://lmnl.im", "https://lmnl.im.localhost"],
    exposedHeaders: ["PAYMENT-REQUIRED"],
  }),
  HttpRouter.add("*", "/*", Assets.forward),
)

export default Worker.make({
  handler: ApiLive.pipe(
    Layer.provide(HttpServer.layerServices),
    HttpRouter.toHttpEffect,
    Effect.flatMap((v) => v),
    Effect.catchCause(() => Effect.succeed(HttpServerResponse.empty({ status: 500 }))),
  ),
  prelude: Layer.empty,
})
