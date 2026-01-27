import { createOpenAI } from "@ai-sdk/openai"
import { embed as embed_ } from "ai"
import { Effect } from "effect"

export const openai = createOpenAI({
  baseURL: "http://localhost:7775",
  apiKey: "",
})

export const embed = (value: string) =>
  Effect.tryPromise(() =>
    embed_({
      model: openai.embeddingModel("text-embedding-ada-002"),
      value,
    })
  ).pipe(
    Effect.map(({ embedding }) => [...embedding]),
  )
