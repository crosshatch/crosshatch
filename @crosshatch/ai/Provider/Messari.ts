import { Effect, Schema as S, SchemaGetter } from "effect"

import * as CustomJsonAdapter from "../CustomJsonAdapter.ts"
import * as LanguageModel402 from "../LanguageModel402.ts"

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
}).pipe(
  S.decodeTo(
    S.Struct({
      message: S.String,
    }),
    {
      decode: SchemaGetter.transform((input) => ({
        message:
          input.data.messages.find((message) => message.role === "assistant")?.content ??
          input.data.messages.at(-1)?.content ??
          "",
      })),
      encode: SchemaGetter.transform((output) => ({
        data: { messages: [{ role: "assistant", content: output.message }] },
      })),
    },
  ),
)

export const layer = LanguageModel402.make({
  model: MODEL,
  adapter: CustomJsonAdapter.layer({
    id: "MessariClient",
    apiUrl: MESSARI_API_URL,
    endpoint: "/chat/completions",
    model: MODEL,
    buildRequest: ({ message }: { readonly message: string }) =>
      Effect.succeed({
        messages: [{ role: "user", content: message }],
        response_format: "markdown",
        stream: false,
        verbosity: "succinct",
      }),
    responseSchema: MessariChatResponse,
  }),
})
