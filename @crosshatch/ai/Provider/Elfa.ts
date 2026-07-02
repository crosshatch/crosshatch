import { Config, Effect, Schema as S, SchemaGetter } from "effect"

import * as CustomJsonAdapter from "../CustomJsonAdapter.ts"
import * as LanguageModel402 from "../LanguageModel402.ts"

const ELFA_API_URL = "https://api.elfa.ai/x402/v2"
export const MODEL = "elfa-chat"

const ElfaChatResponse = S.Struct({
  data: S.Struct({
    message: S.String,
  }),
}).pipe(
  S.decodeTo(
    S.Struct({
      message: S.String,
    }),
    {
      decode: SchemaGetter.transform((input) => ({ message: input.data.message })),
      encode: SchemaGetter.transform((output) => ({ data: { message: output.message } })),
    },
  ),
)

const getSpeed = Config.string("ELFA_SPEED").pipe(Effect.orElseSucceed(() => "expert"))

export const layer = LanguageModel402.make({
  model: MODEL,
  adapter: CustomJsonAdapter.layer({
    id: "ElfaClient",
    apiUrl: ELFA_API_URL,
    endpoint: "/chat",
    model: MODEL,
    buildRequest: ({ message }: { readonly message: string }) =>
      Effect.map(getSpeed, (speed) => ({
        message,
        analysisType: "chat",
        speed,
      })),
    responseSchema: ElfaChatResponse,
  }),
})
