import * as OpenAiClient from "@effect/ai-openai-compat/OpenAiClient"
import * as OpenAiLanguageModel from "@effect/ai-openai-compat/OpenAiLanguageModel"
import { Layer } from "effect"
import { Model } from "effect/unstable/ai"
import { FetchHttpClient } from "effect/unstable/http"

const TELNYX_API_URL = "https://x402.telnyx.com/v1"
export const DEFAULT_MODEL = "MiniMaxAI/MiniMax-M2.7"
const DEFAULT_MAX_TOKENS = 512

export interface Options {
  readonly model?: string
  readonly maxTokens?: number
  readonly temperature?: number
  readonly topP?: number
  readonly stop?: ReadonlyArray<string>
}

/**
 * Payment is not bundled: provide a paying fetch from the outside, e.g.
 * `model().pipe(Layer.provide(Headless.layerConfig(mnemonicConfig, KnownAsset)))`.
 * Without one, requests go out unpaid and fail at runtime with a 402.
 */
export const model = (options?: Options) => {
  const modelName = options?.model ?? DEFAULT_MODEL
  return Model.make(
    "telnyx",
    modelName,
    OpenAiLanguageModel.layer({
      model: modelName,
      config: {
        // `max_output_tokens` is compat's name; it reaches the wire as `max_tokens`
        max_output_tokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
        ...(options?.temperature !== undefined && { temperature: options.temperature }),
        ...(options?.topP !== undefined && { top_p: options.topP }),
        ...(options?.stop !== undefined && { stop: options.stop }),
      },
    }).pipe(Layer.provide(OpenAiClient.layer({ apiUrl: TELNYX_API_URL })), Layer.provide(FetchHttpClient.layer)),
  )
}
