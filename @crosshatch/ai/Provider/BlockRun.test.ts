import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Stream } from "effect"
import { LanguageModel } from "effect/unstable/ai"
import { FetchHttpClient } from "effect/unstable/http"

import * as BlockRun from "./BlockRun.ts"

const capturingFetch = () => {
  const requests: Array<any> = []
  const fetch: typeof globalThis.fetch = async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    requests.push(await request.clone().json())
    return new Response(
      JSON.stringify({
        id: "chatcmpl-test",
        model: "test-model",
        choices: [{ index: 0, message: { role: "assistant", content: "ok" }, finish_reason: "stop" }],
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    )
  }
  return { requests, layer: Layer.succeed(FetchHttpClient.Fetch, fetch) }
}

describe(import.meta.url, () => {
  it("maps model options onto the wire format", async () => {
    const { requests, layer: fetchLayer } = capturingFetch()
    const layer = BlockRun.model({
      model: "openai/gpt-4o-mini",
      maxTokens: 2048,
      temperature: 0.3,
      topP: 0.9,
      stop: ["END"],
      reasoningEffort: "high",
      promptCache: true,
      thinking: { type: "enabled", budget_tokens: 1024 },
    }).pipe(Layer.provide(fetchLayer))
    await LanguageModel.generateText({ prompt: "hi" }).pipe(Effect.provide(layer), Effect.runPromise)

    const body = requests[0]
    assert.strictEqual(body.model, "openai/gpt-4o-mini")
    assert.strictEqual(body.max_tokens, 2048)
    assert.strictEqual(body.temperature, 0.3)
    assert.strictEqual(body.top_p, 0.9)
    assert.deepStrictEqual(body.stop, ["END"])
    assert.strictEqual(body.reasoning_effort, "high")
    assert.strictEqual(body.prompt_cache, true)
    assert.deepStrictEqual(body.thinking, { type: "enabled", budget_tokens: 1024 })
  })

  it("supports streaming", async () => {
    const sseBody = [
      `data: {"id":"c1","choices":[{"index":0,"delta":{"content":"Hi"}}]}`,
      ``,
      `data: {"id":"c1","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}`,
      ``,
      `data: [DONE]`,
      ``,
    ].join("\n")
    const sseFetch: typeof globalThis.fetch = async () =>
      new Response(sseBody, { status: 200, headers: { "content-type": "text/event-stream" } })
    const layer = BlockRun.model().pipe(Layer.provide(Layer.succeed(FetchHttpClient.Fetch, sseFetch)))

    const parts = await LanguageModel.streamText({ prompt: "hi" }).pipe(
      Stream.runCollect,
      Effect.provide(layer),
      Effect.runPromise,
    )

    const text = Array.from(parts)
      .filter((part) => part.type === "text-delta")
      .map((part) => part.delta)
      .join("")
    assert.strictEqual(text, "Hi")
  })
})
