import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai-compat"
import { ChxHttp } from "crosshatch"
import { Console, Effect, Layer } from "effect"
import { LanguageModel } from "effect/unstable/ai"

import { PayerLive } from "./PayerLive.ts"

const BlockrunLive = OpenAiLanguageModel.layer({
  model: "deepseek/deepseek-chat",
}).pipe(
  Layer.provide(
    OpenAiClient.layer({ apiUrl: "https://blockrun.ai/api/v1" }).pipe(
      Layer.provide(ChxHttp.layerClient.pipe(Layer.provide(PayerLive))),
    ),
  ),
)

LanguageModel.generateText({
  prompt: "Hello from Crosshatch.",
}).pipe(
  Effect.tap(({ text }) => Console.log(text)),
  Effect.provide(BlockrunLive),
  Effect.runFork,
)
