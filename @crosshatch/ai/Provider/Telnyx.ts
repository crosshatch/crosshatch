import * as LanguageModel402 from "../LanguageModel402.ts"
import * as OpenAiChatAdapter from "../OpenAiChatAdapter.ts"

const TELNYX_API_URL = "https://x402.telnyx.com/v1"
export const MODEL = "MiniMaxAI/MiniMax-M2.7"
const MAX_TOKENS = 512

export const layer = LanguageModel402.make({
  model: MODEL,
  adapter: OpenAiChatAdapter.layer({
    id: "TelnyxClient",
    apiUrl: TELNYX_API_URL,
    model: MODEL,
    maxTokens: MAX_TOKENS,
  }),
})
