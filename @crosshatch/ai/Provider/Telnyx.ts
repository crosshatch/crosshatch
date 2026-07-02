import { Model } from "effect/unstable/ai"

import * as OpenAiChatCompletions from "../Adapter/OpenAiChatCompletions.ts"

const TELNYX_API_URL = "https://x402.telnyx.com/v1"
export const DEFAULT_MODEL = "MiniMaxAI/MiniMax-M2.7"
const DEFAULT_MAX_TOKENS = 512

export interface Options extends OpenAiChatCompletions.Options {}

export const model = (options?: Options) => {
  const modelName = options?.model ?? DEFAULT_MODEL
  return Model.make(
    "telnyx",
    modelName,
    OpenAiChatCompletions.layer({
      id: "TelnyxClient",
      apiUrl: TELNYX_API_URL,
      model: modelName,
      maxTokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: options?.temperature,
      topP: options?.topP,
      stop: options?.stop,
      streaming: options?.streaming,
    }),
  )
}
