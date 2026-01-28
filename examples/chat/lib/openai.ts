import { createOpenAI } from "@ai-sdk/openai"
import { embed as embed_ } from "ai"
import { makeFetch } from "crosshatch"
import { Effect } from "effect"

export const openai = createOpenAI({
  baseURL: "http://localhost:7775",
  apiKey: "",
  fetch: makeFetch(fetch),
})

export const embed = (value: string) =>
  Effect.tryPromise(() =>
    embed_({
      model: openai.embedding("text-embedding-ada-002"),
      value,
    })
  ).pipe(
    Effect.map(({ embedding }) => [...embedding]),
  )
