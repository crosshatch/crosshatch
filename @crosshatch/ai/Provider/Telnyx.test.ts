import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Stream } from "effect"
import { LanguageModel } from "effect/unstable/ai"

import { capturingFetch, chatChunk, chatCompletion, sseFetch } from "../TestKit.ts"
import * as Telnyx from "./Telnyx.ts"

describe(import.meta.url, () => {
  it("maps model options onto the wire format", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(chatCompletion({ role: "assistant", content: "ok" }))
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

  it("streams text", async () => {
    const { requests, layer: fetchLayer } = sseFetch([
      chatChunk({ role: "assistant", content: "Hi" }),
      chatChunk({}, "stop"),
    ])
    const layer = Telnyx.model().pipe(Layer.provide(fetchLayer))

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
