import { HttpLayerRouter, HttpServer, HttpServerResponse } from "@effect/platform"
import { Layer, Effect } from "effect"
import { Entry } from "liminal-cloudflare"

import { OpenaiProxy } from "./OpenaiProxy.ts"

const ApiLive = Layer.mergeAll(
  HttpLayerRouter.add("GET", "/", Effect.succeed(HttpServerResponse.text("ok"))),
  HttpLayerRouter.use((router) => router.prefixed("/openai").add("*", "/*", OpenaiProxy)),
  HttpLayerRouter.cors({
    allowedHeaders: ["*"],
    allowedMethods: ["*"],
    allowedOrigins: ["https://lmnl.im", "https://local.lmnl.im"],
    exposedHeaders: ["PAYMENT-REQUIRED"],
  }),
)

export default ApiLive.pipe(
  Layer.provide(HttpServer.layerContext),
  HttpLayerRouter.toHttpEffect,
  Effect.flatMap((v) => v),
  Effect.catchAll(() => HttpServerResponse.empty({ status: 500 })),
  Entry.make(Layer.empty),
)
