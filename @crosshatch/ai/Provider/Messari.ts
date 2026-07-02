import { Effect, Schema as S } from "effect"

import * as CustomJsonAdapter from "../Adapter/CustomJson.ts"

const MESSARI_API_URL = "https://api.messari.io/ai/v2"
export const MODEL = "messari"

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

export const layer = CustomJsonAdapter.layer({
  id: "MessariClient",
  apiUrl: MESSARI_API_URL,
  endpoint: "/chat/completions",
  model: MODEL,
  buildRequest: ({ message }) =>
    Effect.succeed({
      messages: [{ role: "user", content: message }],
      response_format: "markdown",
      stream: false,
      verbosity: "succinct",
    }),
  response: {
    schema: MessariChatResponse,
    message: ({ data }) =>
      data.messages.find((message) => message.role === "assistant")?.content ??
      data.messages.at(-1)?.content ??
      "",
  },
})
