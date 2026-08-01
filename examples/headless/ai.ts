import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai-compat"
import * as ChxHttp from "crosshatch/ChxHttp"
import { Console, Effect, Layer } from "effect"
import { LanguageModel } from "effect/unstable/ai"

import * as Prelude from "./Prelude.ts"

const layerLanguageModelBlockrun = OpenAiLanguageModel.layer({
  model: "deepseek/deepseek-chat",
}).pipe(
  Layer.provide(
    OpenAiClient.layer({ apiUrl: "https://blockrun.ai/api/v1" }).pipe(
      Layer.provide(ChxHttp.layerClient.pipe(Layer.provide(Prelude.layer))),
    ),
  ),
)

LanguageModel.generateText({
  prompt: "Hello from Crosshatch.",
}).pipe(
  Effect.tap(({ text }) => Console.log(text)),
  Effect.provide(layerLanguageModelBlockrun),
  Effect.onError(Effect.logError),
  Effect.runFork,
)
