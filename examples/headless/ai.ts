import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai-compat"
import { ChxHttp } from "crosshatch"
import { Console, Effect, Layer } from "effect"
import { LanguageModel } from "effect/unstable/ai"
import { FetchHttpClient } from "effect/unstable/http"

import { PayerLive } from "./PayerLive.ts"

const BlockrunLive = OpenAiLanguageModel.layer({ model: "deepseek/deepseek-chat" }).pipe(
  Layer.provide(
    OpenAiClient.layer({ apiUrl: "https://blockrun.ai/api/v1" }).pipe(
      Layer.provide(
        ChxHttp.layerClient(ChxHttp.Payment.resolver).pipe(Layer.provide([FetchHttpClient.layer, PayerLive])),
      ),
    ),
  ),
)

LanguageModel.generateText({
  prompt: "Hello from Crosshatch.",
}).pipe(
  Effect.tap(({ text }) => Console.log(text)),
  Effect.provide(BlockrunLive),
  Effect.onError(Effect.logError),
  Effect.runFork,
)
