import { boundLayer } from "@crosshatch/util/boundLayer"
import { OpenAiClient, OpenAiEmbeddingModel } from "@effect/ai-openai"
import { HttpClient } from "crosshatch/X402"
import { Effect, Layer, Redacted, Config } from "effect"
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
        Effect.map((dev) =>
          Layer.mergeAll(
            OpenAiClient.layer({
              apiKey: Redacted.make(""),
              apiUrl: `https://lmnl.im${dev ? ".localhost" : ""}/openai`,
            }).pipe(Layer.provideMerge(HttpClient)),
          ),
        ),
        Layer.unwrap,
      ),
  ),
  boundLayer("lmnl.im"),
  Atom.runtime,
)
