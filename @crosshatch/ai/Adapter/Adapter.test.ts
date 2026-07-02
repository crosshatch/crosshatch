import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Schema as S, Stream } from "effect"
import { AiError, LanguageModel, Prompt } from "effect/unstable/ai"
import { FetchHttpClient } from "effect/unstable/http"

import * as SingleMessage from "./SingleMessage.ts"

const stubFetch =
  (body: unknown): typeof globalThis.fetch =>
  async () =>
    new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } })

const provideFetch = (body: unknown) => Layer.succeed(FetchHttpClient.Fetch, stubFetch(body))

const rejectingFetch: typeof globalThis.fetch = async (input) => {
  throw new Error(`unexpected fetch: ${input instanceof Request ? input.url : String(input)}`)
}

const provideRejectingFetch = () => Layer.succeed(FetchHttpClient.Fetch, rejectingFetch)

const singleMessageLayer = SingleMessage.layer({
  id: "TestClient",
  url: "https://provider.test/chat",
  model: "test-model",
  request: (message) => ({ message }),
  response: {
    schema: S.Struct({ data: S.Struct({ message: S.String }) }),
    message: ({ data }) => data.message,
  },
})

describe(import.meta.url, () => {
  it("generates text through the single-message adapter", async () => {
    const layer = singleMessageLayer.pipe(Layer.provide(provideFetch({ data: { message: "Hello from json." } })))
    const response = await LanguageModel.generateText({ prompt: "hi" }).pipe(Effect.provide(layer), Effect.runPromise)
    assert.strictEqual(response.text, "Hello from json.")
    assert.strictEqual(response.finishReason, "stop")
  })

  it("flattens the conversation into a single provider message", () => {
    const prompt = Prompt.make([
      { role: "system", content: "Be brief." },
      { role: "user", content: "What is x402?" },
      { role: "assistant", content: [{ type: "text", text: "A payment protocol." }] },
      { role: "user", content: "Elaborate." },
    ])
    assert.strictEqual(
      SingleMessage.toMessage(prompt),
      "system: Be brief.\n\nuser: What is x402?\n\nassistant: A payment protocol.\n\nuser: Elaborate.",
    )
  })

  it("fails streaming through the single-message adapter without touching the network", async () => {
    const layer = singleMessageLayer.pipe(Layer.provide(provideRejectingFetch()))
    const error = await LanguageModel.streamText({ prompt: "hi" }).pipe(
      Stream.runDrain,
      Effect.flip,
      Effect.provide(layer),
      Effect.runPromise,
    )
    assert.isTrue(AiError.isAiError(error))
    assert.strictEqual(error.reason._tag, "InvalidRequestError")
  })
})
