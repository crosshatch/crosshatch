import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Schema as S, SchemaGetter } from "effect"
import { LanguageModel } from "effect/unstable/ai"
import { FetchHttpClient } from "effect/unstable/http"

import * as CustomJsonAdapter from "./CustomJsonAdapter.ts"
import * as LanguageModel402 from "./LanguageModel402.ts"
import * as OpenAiChatAdapter from "./OpenAiChatAdapter.ts"

const stubFetch = (body: unknown): typeof globalThis.fetch => async () =>
  new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } })

const provideFetch = (body: unknown) => Layer.succeed(FetchHttpClient.Fetch, stubFetch(body))

describe(import.meta.url, () => {
  it("generates text through the openai-chat adapter", async () => {
    const layer = LanguageModel402.make({
      model: "test-model",
      adapter: OpenAiChatAdapter.layer({
        id: "TestClient",
        apiUrl: "https://provider.test/v1",
        model: "test-model",
        maxTokens: 16,
      }),
    }).pipe(
      Layer.provide(
        provideFetch({
          id: "chatcmpl-1",
          object: "chat.completion",
          created: 1,
          model: "test-model",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: "Hello from chat." },
              finish_reason: "stop",
            },
          ],
          usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
        }),
      ),
    )
    const response = await LanguageModel.generateText({ prompt: "hi" }).pipe(
      Effect.provide(layer),
      Effect.runPromise,
    )
    assert.strictEqual(response.text, "Hello from chat.")
  })

  it("generates text through the custom-json adapter", async () => {
    const layer = LanguageModel402.make({
      model: "test-model",
      adapter: CustomJsonAdapter.layer({
        id: "TestClient",
        apiUrl: "https://provider.test",
        endpoint: "/chat",
        model: "test-model",
        buildRequest: ({ message }) => Effect.succeed({ message }),
        responseSchema: S.Struct({ data: S.Struct({ message: S.String }) }).pipe(
          S.decodeTo(S.Struct({ message: S.String }), {
            decode: SchemaGetter.transform((input) => ({ message: input.data.message })),
            encode: SchemaGetter.transform((output) => ({ data: { message: output.message } })),
          }),
        ),
      }),
    }).pipe(Layer.provide(provideFetch({ data: { message: "Hello from json." } })))
    const response = await LanguageModel.generateText({ prompt: "hi" }).pipe(
      Effect.provide(layer),
      Effect.runPromise,
    )
    assert.strictEqual(response.text, "Hello from json.")
  })
})
