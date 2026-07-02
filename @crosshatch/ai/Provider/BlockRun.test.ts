import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Schema as S, Stream } from "effect"
import { AiError, LanguageModel, Prompt, Tool, Toolkit } from "effect/unstable/ai"

import { capturingFetch, chatChunk, chatCompletion, errorFetch, sseFetch } from "../TestKit.ts"
import * as BlockRun from "./BlockRun.ts"

const WeatherToolkit = Toolkit.make(
  Tool.make("get_weather", {
    description: "Get the current weather for a city",
    parameters: S.Struct({ city: S.String }),
    success: S.Struct({ city: S.String, temp: S.Number }),
  }),
)

const toolCallCompletion = chatCompletion(
  {
    role: "assistant",
    content: null,
    tool_calls: [{ id: "call_1", type: "function", function: { name: "get_weather", arguments: `{"city":"Tokyo"}` } }],
  },
  "tool_calls",
)

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

  it("streams text", async () => {
    const { requests, layer: fetchLayer } = sseFetch([
      chatChunk({ role: "assistant", content: "Hi" }),
      chatChunk({}, "stop"),
    ])
    const layer = BlockRun.model().pipe(Layer.provide(fetchLayer))

    const parts = await LanguageModel.streamText({ prompt: "hi" }).pipe(
      Stream.runCollect,
      Effect.provide(layer),
      Effect.runPromise,
    )

    assert.strictEqual(requests[0].stream, true)
    assert.deepStrictEqual(requests[0].stream_options, { include_usage: true })
    const partList = Array.from(parts)
    const text = partList
      .filter((part) => part.type === "text-delta")
      .map((part) => part.delta)
      .join("")
    assert.strictEqual(text, "Hi")
    const finish = partList.find((part) => part.type === "finish")
    assert.strictEqual(finish?.reason, "stop")
  })

  it("sends tool definitions and decodes tool calls", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(toolCallCompletion)
    const layer = BlockRun.model().pipe(Layer.provide(fetchLayer))
    const response = await LanguageModel.generateText({
      prompt: "What's the weather in Tokyo?",
      toolkit: WeatherToolkit,
      disableToolCallResolution: true,
    }).pipe(Effect.provide(layer), Effect.runPromise)

    const body = requests[0]
    assert.lengthOf(body.tools, 1)
    assert.strictEqual(body.tools[0].type, "function")
    assert.strictEqual(body.tools[0].function.name, "get_weather")
    assert.strictEqual(body.tools[0].function.description, "Get the current weather for a city")
    assert.strictEqual(body.tools[0].function.parameters.properties.city.type, "string")

    assert.strictEqual(response.finishReason, "tool-calls")
    assert.lengthOf(response.toolCalls, 1)
    assert.strictEqual(response.toolCalls[0]?.id, "call_1")
    assert.strictEqual(response.toolCalls[0]?.name, "get_weather")
    assert.deepStrictEqual(response.toolCalls[0]?.params, { city: "Tokyo" })
  })

  it("serializes tool calls and tool results from the conversation history", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(
      chatCompletion({ role: "assistant", content: "It is sunny in Tokyo." }),
    )
    const layer = BlockRun.model().pipe(Layer.provide(fetchLayer))
    const prompt = Prompt.make([
      { role: "user", content: "What's the weather in Tokyo?" },
      {
        role: "assistant",
        content: [{ type: "tool-call", id: "call_1", name: "get_weather", params: { city: "Tokyo" } }],
      },
      {
        role: "tool",
        content: [{ type: "tool-result", id: "call_1", name: "get_weather", isFailure: false, result: { temp: 21 } }],
      },
    ])
    await LanguageModel.generateText({ prompt }).pipe(Effect.provide(layer), Effect.runPromise)

    const messages = requests[0].messages
    assert.deepStrictEqual(messages[1], {
      role: "assistant",
      content: null,
      tool_calls: [
        { id: "call_1", type: "function", function: { name: "get_weather", arguments: `{"city":"Tokyo"}` } },
      ],
    })
    assert.deepStrictEqual(messages[2], {
      role: "tool",
      tool_call_id: "call_1",
      content: `{"temp":21}`,
    })
  })

  it("requests structured output via response_format when generating objects", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(
      chatCompletion({ role: "assistant", content: `{"city":"Tokyo","temp":21}` }),
    )
    const layer = BlockRun.model().pipe(Layer.provide(fetchLayer))
    const response = await LanguageModel.generateObject({
      prompt: "Weather in Tokyo as JSON",
      schema: S.Struct({ city: S.String, temp: S.Number }),
      objectName: "weather",
    }).pipe(Effect.provide(layer), Effect.runPromise)

    assert.deepStrictEqual(response.value, { city: "Tokyo", temp: 21 })
    const responseFormat = requests[0].response_format
    assert.strictEqual(responseFormat.type, "json_schema")
    assert.strictEqual(responseFormat.json_schema.name, "weather")
    assert.strictEqual(responseFormat.json_schema.schema.properties.city.type, "string")
  })

  it("surfaces HTTP error statuses from generateText as status-based errors", async () => {
    const layer = BlockRun.model().pipe(Layer.provide(errorFetch(429)))
    const error = await LanguageModel.generateText({ prompt: "hi" }).pipe(
      Effect.flip,
      Effect.provide(layer),
      Effect.runPromise,
    )
    assert.isTrue(AiError.isAiError(error))
    assert.strictEqual(error.reason._tag, "RateLimitError")
  })

  it("fails streaming on HTTP error statuses instead of ending as an empty stream", async () => {
    const layer = BlockRun.model().pipe(Layer.provide(errorFetch(500)))
    const error = await LanguageModel.streamText({ prompt: "hi" }).pipe(
      Stream.runDrain,
      Effect.flip,
      Effect.provide(layer),
      Effect.runPromise,
    )
    assert.isTrue(AiError.isAiError(error))
    assert.strictEqual(error.reason._tag, "InternalProviderError")
  })
})
