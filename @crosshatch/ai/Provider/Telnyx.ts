import * as OpenAiChatCompletions from "../Adapter/OpenAiChatCompletions.ts"

const TELNYX_API_URL = "https://x402.telnyx.com/v1"
export const MODEL = "MiniMaxAI/MiniMax-M2.7"
const MAX_TOKENS = 512

export const layer = OpenAiChatCompletions.layer({
  id: "TelnyxClient",
  apiUrl: TELNYX_API_URL,
  model: MODEL,
  maxTokens: MAX_TOKENS,
})
