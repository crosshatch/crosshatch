import { Model } from "effect/unstable/ai"

import * as OpenAiChatCompletions from "../Adapter/OpenAiChatCompletions.ts"

const BLOCKRUN_API_URL = "https://blockrun.ai/api/v1"
export const DEFAULT_MODEL = "openai/gpt-5-nano"
const DEFAULT_MAX_TOKENS = 512

export type ReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh"

export interface Options extends OpenAiChatCompletions.Options {
  readonly reasoningEffort?: ReasoningEffort
  readonly thinking?: { readonly type: "enabled"; readonly budget_tokens: number } | { readonly type: "disabled" }
  readonly promptCache?: boolean
}

export const model = (options?: Options) => {
  const modelName = options?.model ?? DEFAULT_MODEL
  return Model.make(
    "blockrun",
    modelName,
    OpenAiChatCompletions.layer({
      id: "BlockRunClient",
      apiUrl: BLOCKRUN_API_URL,
      model: modelName,
      maxTokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
      streaming: options?.streaming ?? true,
      temperature: options?.temperature,
      topP: options?.topP,
      stop: options?.stop,
      extraBody: {
        ...(options?.reasoningEffort !== undefined && { reasoning_effort: options.reasoningEffort }),
        ...(options?.thinking !== undefined && { thinking: options.thinking }),
        ...(options?.promptCache !== undefined && { prompt_cache: options.promptCache }),
      },
    }),
  )
}
