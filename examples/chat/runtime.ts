import { LoggerLive } from "@crosshatch/util/LoggerLive"
import { Atom } from "@effect-atom/atom-react"
import { OpenAiClient, OpenAiEmbeddingModel } from "@effect/ai-openai"
import { HttpClient } from "crosshatch/X402"
import { ConfigProvider, Effect, Layer, Redacted, Config } from "effect"

import { Drizzle, PgliteClient } from "./Drizzle"

export const runtime = Atom.runtime(
  Layer.mergeAll(
    Drizzle.Default.pipe(Layer.provideMerge(PgliteClient.Default)),
    OpenAiEmbeddingModel.model("text-embedding-ada-002", { mode: "batched" }),
  ).pipe(
    Layer.provideMerge(
      Config.boolean("DEV").pipe(
        Config.withDefault(true),
        Effect.map((dev) => `https://${dev ? "local." : ""}lmnl.im`),
        Effect.map((shapesUrl) =>
          Layer.mergeAll(
            OpenAiClient.layer({
              apiKey: Redacted.make(""),
              apiUrl: `${shapesUrl}/openai`,
            }),
          ),
        ),
        Layer.unwrapEffect,
      ),
    ),
    Layer.provideMerge(HttpClient),
    Layer.provideMerge(
      LoggerLive.pipe(Layer.provideMerge(Layer.setConfigProvider(ConfigProvider.fromJson(import.meta.env)))),
    ),
  ),
)
