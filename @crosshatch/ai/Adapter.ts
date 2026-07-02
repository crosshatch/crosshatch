import type { OpenAiClient } from "@effect/ai-openai"
import { Context } from "effect"

export class LanguageModelAdapter extends Context.Service<
  LanguageModelAdapter,
  {
    readonly createResponse: OpenAiClient.Service["createResponse"]
  }
>()("@crosshatch/ai/LanguageModelAdapter") {}
