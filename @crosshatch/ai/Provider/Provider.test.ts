import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer } from "effect"
import { LanguageModel } from "effect/unstable/ai"
import { FetchHttpClient } from "effect/unstable/http"

import * as BlockRun from "./BlockRun.ts"
import * as Telnyx from "./Telnyx.ts"

/**
 * A fetch stub that captures every request body and replies with a minimal
 * chat-completions body.
 */
const capturingFetch = () => {
  const requests: Array<any> = []
  const body = {
    id: "chatcmpl-test",
    object: "chat.completion",
    created: 1,
    model: "test-model",
    choices: [{ index: 0, message: { role: "assistant", content: "ok" }, finish_reason: "stop" }],
    usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
  }
  const fetch: typeof globalThis.fetch = async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    requests.push(await request.clone().json())
    return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } })
  }
  return { requests, layer: Layer.succeed(FetchHttpClient.Fetch, fetch) }
}

// compat's config passes unknown keys through to the wire, so a misspelled
// wire name typechecks and is silently ignored by the provider; these pin
// the exact keys that reach the request body
describe(import.meta.url, () => {
  it("maps BlockRun options onto the wire format", async () => {
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

  it("omits unset options from the wire", async () => {
    const { requests, layer: fetchLayer } = capturingFetch()
    const layer = BlockRun.model().pipe(Layer.provide(fetchLayer))
    await LanguageModel.generateText({ prompt: "hi" }).pipe(Effect.provide(layer), Effect.runPromise)

    const body = requests[0]
    assert.notProperty(body, "temperature")
    assert.notProperty(body, "stop")
    assert.notProperty(body, "reasoning_effort")
  })

  it("maps Telnyx options onto the wire format", async () => {
    const { requests, layer: fetchLayer } = capturingFetch()
    const layer = Telnyx.model({
      model: "MiniMaxAI/MiniMax-M2.7",
      maxTokens: 2048,
      temperature: 0.3,
      topP: 0.9,
      stop: ["END"],
    }).pipe(Layer.provide(fetchLayer))
    await LanguageModel.generateText({ prompt: "hi" }).pipe(Effect.provide(layer), Effect.runPromise)

    const body = requests[0]
    assert.strictEqual(body.model, "MiniMaxAI/MiniMax-M2.7")
    assert.strictEqual(body.max_tokens, 2048)
    assert.strictEqual(body.temperature, 0.3)
    assert.strictEqual(body.top_p, 0.9)
    assert.deepStrictEqual(body.stop, ["END"])
  })
})
