import { Schema as S } from "effect"
import { Model } from "effect/unstable/ai"

import * as SingleMessage from "../Adapter/SingleMessage.ts"

const MESSARI_API_URL = "https://api.messari.io/ai/v2"
const MODEL = "messari"

const MessariChatResponse = S.Struct({
  data: S.Struct({
    messages: S.Array(
      S.Struct({
        role: S.optional(S.String),
        content: S.String,
      }),
    ),
  }),
})

const layer = SingleMessage.layer({
  id: "MessariClient",
  url: `${MESSARI_API_URL}/chat/completions`,
  model: MODEL,
  request: (message) => ({
    messages: [{ role: "user", content: message }],
    response_format: "markdown",
    stream: false,
    verbosity: "succinct",
  }),
  response: {
    schema: MessariChatResponse,
    // the reply comes back as a chat-history array: prefer the message tagged
    // assistant, fall back to the last one, and degrade to empty text (not an
    // error) if the array is somehow empty
    message: ({ data }) =>
      data.messages.find((message) => message.role === "assistant")?.content ?? data.messages.at(-1)?.content ?? "",
  },
})

export const model = Model.make("messari", MODEL, layer)
