import { Model } from "effect/unstable/ai"

import * as OpenAiChatCompletions from "../Adapter/OpenAiChatCompletions.ts"

const BLOCKRUN_API_URL = "https://blockrun.ai/api/v1"
export const DEFAULT_MODEL = "openai/gpt-5-nano"
const DEFAULT_MAX_TOKENS = 512

export const model = (modelName: string = DEFAULT_MODEL, options?: { readonly maxTokens?: number }) =>
  Model.make(
    "blockrun",
    modelName,
    OpenAiChatCompletions.layer({
      id: "BlockRunClient",
      apiUrl: BLOCKRUN_API_URL,
      model: modelName,
      maxTokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
    }),
  )
