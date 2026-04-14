import { Layer, Effect } from "effect"
import { HttpRouter, HttpServer, HttpServerResponse } from "effect/unstable/http"
import { Assets, Entry } from "liminal-cloudflare"

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

export default ApiLive.pipe(
  Layer.provide(HttpServer.layerServices),
  HttpRouter.toHttpEffect,
  Effect.flatMap((v) => v),
  Effect.catchCause(() => Effect.succeed(HttpServerResponse.empty({ status: 500 }))),
  Entry.make(Layer.empty),
)
