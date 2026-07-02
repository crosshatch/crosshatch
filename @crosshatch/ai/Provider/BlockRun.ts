import * as LanguageModel402 from "../LanguageModel402.ts"
import * as OpenAiChatAdapter from "../OpenAiChatAdapter.ts"

const BLOCKRUN_API_URL = "https://blockrun.ai/api/v1"
export const MODEL = "openai/gpt-5-nano"
const MAX_TOKENS = 512

export const layer = LanguageModel402.make({
  model: MODEL,
  adapter: OpenAiChatAdapter.layer({
    id: "BlockRunClient",
    apiUrl: BLOCKRUN_API_URL,
    model: MODEL,
    maxTokens: MAX_TOKENS,
  }),
})
