import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai-compat"
import { Http402 } from "crosshatch"
import { Console, Effect, Layer } from "effect"
import { LanguageModel } from "effect/unstable/ai"

import { PayerLive } from "./_common.ts"

const BlockrunLive = OpenAiLanguageModel.layer({ model: "deepseek/deepseek-chat" }).pipe(
  Layer.provide(OpenAiClient.layer({ apiUrl: "https://blockrun.ai/api/v1" })),
)

LanguageModel.generateText({
  prompt: "Hello from Crosshatch.",
}).pipe(
  Effect.tap(({ text }) => Console.log(text)),
  Effect.provide(BlockrunLive.pipe(Layer.provide(Http402.layerClient.pipe(Layer.provide(PayerLive))))),
  Effect.runFork,
)
