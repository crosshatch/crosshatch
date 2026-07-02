import { Schema as S } from "effect"
import { Model } from "effect/unstable/ai"

import * as SingleMessage from "../Adapter/SingleMessage.ts"

const ELFA_API_URL = "https://api.elfa.ai/x402/v2"
const MODEL = "elfa-chat"

const ElfaChatResponse = S.Struct({
  data: S.Struct({
    message: S.String,
  }),
})

// pricing is speed-based: `fast` $0.045 per request, `expert` $0.162
export type Speed = "fast" | "expert"

export interface Options {
  readonly speed?: Speed
}

export const model = (options?: Options) => {
  const speed = options?.speed ?? "fast"
  return Model.make(
    "elfa",
    MODEL,
    SingleMessage.layer({
      id: "ElfaClient",
      url: `${ELFA_API_URL}/chat`,
      model: MODEL,
      request: (message) => ({
        message,
        analysisType: "chat",
        speed,
      }),
      response: {
        schema: ElfaChatResponse,
        message: ({ data }) => data.message,
      },
    }),
  )
}
