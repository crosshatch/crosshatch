import { annotateLogsLayer } from "@crosshatch/util/annotateLogsLayer"
import { OpenAiClient, OpenAiEmbeddingModel } from "@effect/ai-openai"
import { HttpClient } from "crosshatch/X402"
import { Effect, Layer, Redacted, Config, References } from "effect"
import { Atom } from "effect/unstable/reactivity"

import { Drizzle, PgliteClient } from "./Drizzle"

export const runtime = Layer.mergeAll(
  Drizzle.layer.pipe(Layer.provideMerge(PgliteClient.layer)),
  OpenAiEmbeddingModel.model("text-embedding-ada-002", { dimensions: 1536 }),
).pipe(
  Layer.provideMerge(
    Config.boolean("DEV")
      .pipe(Config.withDefault(true))
      .asEffect()
      .pipe(
        Effect.map((dev) => `https://lmnl.im${dev ? ".localhost" : ""}`),
        Effect.map((lmnlimUrl) =>
          Layer.mergeAll(
            OpenAiClient.layer({
              apiKey: Redacted.make(""),
              apiUrl: `${lmnlimUrl}/openai`,
            }),
          ),
        ),
        Layer.unwrap,
      ),
  ),
  Layer.provideMerge(HttpClient),
  Layer.tapError(Effect.logError),
  annotateLogsLayer({ context: "lmnl.im" }),
  Layer.provideMerge(Layer.succeed(References.MinimumLogLevel, "All")),
  Atom.runtime,
)
