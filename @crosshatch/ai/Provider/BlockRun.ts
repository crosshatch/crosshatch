import * as OpenAiChatCompletions from "../Adapter/OpenAiChatCompletions.ts"

const BLOCKRUN_API_URL = "https://blockrun.ai/api/v1"
export const MODEL = "openai/gpt-5-nano"
const MAX_TOKENS = 512

export const layer = OpenAiChatCompletions.layer({
  id: "BlockRunClient",
  apiUrl: BLOCKRUN_API_URL,
  model: MODEL,
  maxTokens: MAX_TOKENS,
})
