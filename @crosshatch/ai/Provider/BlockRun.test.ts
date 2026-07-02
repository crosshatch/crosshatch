import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Stream } from "effect"
import { LanguageModel } from "effect/unstable/ai"

import { capturingFetch, chatCompletion, sseFetch } from "../TestKit.ts"
import * as BlockRun from "./BlockRun.ts"

describe(import.meta.url, () => {
  it("maps model options onto the wire format", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(chatCompletion({ role: "assistant", content: "ok" }))
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

  it("streams by default", async () => {
    const { requests, layer: fetchLayer } = sseFetch([
      `{"id":"c1","choices":[{"index":0,"delta":{"content":"Hi"}}]}`,
      `{"id":"c1","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}`,
    ])
    const layer = BlockRun.model().pipe(Layer.provide(fetchLayer))

    const parts = await LanguageModel.streamText({ prompt: "hi" }).pipe(
      Stream.runCollect,
      Effect.provide(layer),
      Effect.runPromise,
    )

    assert.strictEqual(requests[0].stream, true)
    const text = Array.from(parts)
      .filter((part) => part.type === "text-delta")
      .map((part) => part.delta)
      .join("")
    assert.strictEqual(text, "Hi")
  })
})
