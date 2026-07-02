import { Config, Effect, Schema as S } from "effect"

import * as CustomJsonAdapter from "../Adapter/CustomJson.ts"

const ELFA_API_URL = "https://api.elfa.ai/x402/v2"
export const MODEL = "elfa-chat"

const ElfaChatResponse = S.Struct({
  data: S.Struct({
    message: S.String,
  }),
})

const getSpeed = Config.string("ELFA_SPEED").pipe(Effect.orElseSucceed(() => "expert"))

export const layer = CustomJsonAdapter.layer({
  id: "ElfaClient",
  apiUrl: ELFA_API_URL,
  endpoint: "/chat",
  model: MODEL,
  buildRequest: ({ message }) =>
    Effect.map(getSpeed, (speed) => ({
      message,
      analysisType: "chat",
      speed,
    })),
  response: {
    schema: ElfaChatResponse,
    message: ({ data }) => data.message,
  },
})
