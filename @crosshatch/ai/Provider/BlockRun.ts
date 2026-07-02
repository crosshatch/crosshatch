import * as OpenAiClient from "@effect/ai-openai-compat/OpenAiClient"
import * as OpenAiLanguageModel from "@effect/ai-openai-compat/OpenAiLanguageModel"
import { Layer } from "effect"
import { Model } from "effect/unstable/ai"
import { FetchHttpClient } from "effect/unstable/http"

const BLOCKRUN_API_URL = "https://blockrun.ai/api/v1"
export const DEFAULT_MODEL = "openai/gpt-5-nano"
const DEFAULT_MAX_TOKENS = 512

export type ReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh"

export interface Options {
  readonly model?: string
  readonly maxTokens?: number
  readonly temperature?: number
  readonly topP?: number
  readonly stop?: ReadonlyArray<string>
  readonly reasoningEffort?: ReasoningEffort
  readonly thinking?: { readonly type: "enabled"; readonly budget_tokens: number } | { readonly type: "disabled" }
  readonly promptCache?: boolean
}

/**
 * Nothing in the types requires a paying `Fetch` (e.g. `Headless.layerConfig`);
 * without one in context, requests go out unpaid and 402 at runtime.
 */
export const model = (options?: Options) => {
  const modelName = options?.model ?? DEFAULT_MODEL
  return Model.make(
    "blockrun",
    modelName,
    OpenAiLanguageModel.layer({
      model: modelName,
      config: {
        // `max_output_tokens` is compat's name; it reaches the wire as
        // `max_tokens`. Keys compat doesn't know pass through verbatim, and
        // unset options are dropped by JSON serialization.
        max_output_tokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: options?.temperature,
        top_p: options?.topP,
        stop: options?.stop,
        reasoning_effort: options?.reasoningEffort,
        thinking: options?.thinking,
        prompt_cache: options?.promptCache,
      },
    }).pipe(Layer.provide(OpenAiClient.layer({ apiUrl: BLOCKRUN_API_URL })), Layer.provide(FetchHttpClient.layer)),
  )
}
