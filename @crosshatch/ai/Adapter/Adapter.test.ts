import { assert, describe, it } from "@effect/vitest"
import { Effect, Layer, Schema as S, Stream } from "effect"
import { AiError, LanguageModel, Prompt, Tool, Toolkit } from "effect/unstable/ai"
import { FetchHttpClient } from "effect/unstable/http"

import { capturingFetch, chatCompletion, sseFetch } from "../TestKit.ts"
import * as OpenAiChatCompletions from "./OpenAiChatCompletions.ts"
import * as SingleMessage from "./SingleMessage.ts"

const stubFetch =
  (body: unknown): typeof globalThis.fetch =>
  async () =>
    new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } })

const provideFetch = (body: unknown) => Layer.succeed(FetchHttpClient.Fetch, stubFetch(body))

const toolCallCompletion = chatCompletion(
  {
    role: "assistant",
    content: null,
    tool_calls: [{ id: "call_1", type: "function", function: { name: "get_weather", arguments: `{"city":"Tokyo"}` } }],
  },
  "tool_calls",
)

const WeatherToolkit = Toolkit.make(
  Tool.make("get_weather", {
    description: "Get the current weather for a city",
    parameters: S.Struct({ city: S.String }),
    success: S.Struct({ city: S.String, temp: S.Number }),
  }),
)

const BellToolkit = Toolkit.make(
  Tool.make("ring_bell", {
    description: "Ring the bell",
    parameters: S.Struct({}),
    success: S.Struct({ rang: S.Boolean }),
  }),
)

const errorFetch =
  (status: number): typeof globalThis.fetch =>
  async () =>
    new Response(JSON.stringify({ error: { message: "boom" } }), {
      status,
      headers: { "content-type": "application/json" },
    })

const rejectingFetch: typeof globalThis.fetch = async (input) => {
  throw new Error(`unexpected fetch: ${input instanceof Request ? input.url : String(input)}`)
}

const provideRejectingFetch = () => Layer.succeed(FetchHttpClient.Fetch, rejectingFetch)

const openAiChatLayer = OpenAiChatCompletions.layer({
  id: "TestClient",
  apiUrl: "https://provider.test/v1",
  model: "test-model",
  maxTokens: 16,
})

const openAiStreamingLayer = OpenAiChatCompletions.layer({
  id: "TestClient",
  apiUrl: "https://provider.test/v1",
  model: "test-model",
  maxTokens: 16,
  streaming: true,
})

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
  it("generates text through the openai-chat adapter", async () => {
    const layer = openAiChatLayer.pipe(
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
    const response = await LanguageModel.generateText({ prompt: "hi" }).pipe(Effect.provide(layer), Effect.runPromise)
    assert.strictEqual(response.text, "Hello from chat.")
  })

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

  it("sends tool definitions and tool choice to the provider", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(toolCallCompletion)
    const layer = openAiChatLayer.pipe(Layer.provide(fetchLayer))
    await LanguageModel.generateText({
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
    assert.strictEqual(body.tool_choice, "auto")
  })

  it("decodes tool calls from the provider response", async () => {
    const { layer: fetchLayer } = capturingFetch(toolCallCompletion)
    const layer = openAiChatLayer.pipe(Layer.provide(fetchLayer))
    const response = await LanguageModel.generateText({
      prompt: "What's the weather in Tokyo?",
      toolkit: WeatherToolkit,
      disableToolCallResolution: true,
    }).pipe(Effect.provide(layer), Effect.runPromise)

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
    const layer = openAiChatLayer.pipe(Layer.provide(fetchLayer))
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

  it("decodes empty tool-call arguments as an empty object", async () => {
    const { layer: fetchLayer } = capturingFetch(
      chatCompletion(
        {
          role: "assistant",
          content: null,
          tool_calls: [{ id: "call_1", type: "function", function: { name: "ring_bell", arguments: "" } }],
        },
        "tool_calls",
      ),
    )
    const layer = openAiChatLayer.pipe(Layer.provide(fetchLayer))
    const response = await LanguageModel.generateText({
      prompt: "Ring the bell.",
      toolkit: BellToolkit,
      disableToolCallResolution: true,
    }).pipe(Effect.provide(layer), Effect.runPromise)

    assert.deepStrictEqual(response.toolCalls[0]?.params, {})
  })

  it("serializes undefined tool results as explicit JSON null content", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(chatCompletion({ role: "assistant", content: "Done." }))
    const layer = openAiChatLayer.pipe(Layer.provide(fetchLayer))
    const prompt = Prompt.make([
      { role: "user", content: "Ring the bell." },
      {
        role: "assistant",
        content: [{ type: "tool-call", id: "call_1", name: "ring_bell", params: {} }],
      },
      {
        role: "tool",
        content: [{ type: "tool-result", id: "call_1", name: "ring_bell", isFailure: false, result: undefined }],
      },
    ])
    await LanguageModel.generateText({ prompt }).pipe(Effect.provide(layer), Effect.runPromise)

    assert.deepStrictEqual(requests[0].messages[2], {
      role: "tool",
      tool_call_id: "call_1",
      content: "null",
    })
  })

  it("keeps empty assistant history messages as empty-string content", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(
      chatCompletion({ role: "assistant", content: "Continuing." }),
    )
    const layer = openAiChatLayer.pipe(Layer.provide(fetchLayer))
    const prompt = Prompt.make([
      { role: "user", content: "Go on." },
      // e.g. a reply truncated mid-reasoning: no text, no tool calls
      { role: "assistant", content: [{ type: "text", text: "" }] },
      { role: "user", content: "Continue." },
    ])
    await LanguageModel.generateText({ prompt }).pipe(Effect.provide(layer), Effect.runPromise)

    assert.deepStrictEqual(requests[0].messages[1], { role: "assistant", content: "" })
  })

  it("requests structured output via response_format when generating objects", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(
      chatCompletion({ role: "assistant", content: `{"city":"Tokyo","temp":21}` }),
    )
    const layer = openAiChatLayer.pipe(Layer.provide(fetchLayer))
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

  it("sends sampling options and extra body fields", async () => {
    const { requests, layer: fetchLayer } = capturingFetch(chatCompletion({ role: "assistant", content: "ok" }))
    const layer = OpenAiChatCompletions.layer({
      id: "TestClient",
      apiUrl: "https://provider.test/v1",
      model: "test-model",
      maxTokens: 16,
      temperature: 0.2,
      topP: 0.9,
      stop: ["END"],
      extraBody: { reasoning_effort: "low" },
    }).pipe(Layer.provide(fetchLayer))
    await LanguageModel.generateText({ prompt: "hi" }).pipe(Effect.provide(layer), Effect.runPromise)

    const body = requests[0]
    assert.strictEqual(body.temperature, 0.2)
    assert.strictEqual(body.top_p, 0.9)
    assert.deepStrictEqual(body.stop, ["END"])
    assert.strictEqual(body.reasoning_effort, "low")
  })

  it("decodes reasoning content into reasoning parts", async () => {
    const { layer: fetchLayer } = capturingFetch(
      chatCompletion({
        role: "assistant",
        content: "The answer is 4.",
        reasoning_content: "2 + 2 means adding two and two.",
      }),
    )
    const layer = openAiChatLayer.pipe(Layer.provide(fetchLayer))
    const response = await LanguageModel.generateText({ prompt: "2+2?" }).pipe(Effect.provide(layer), Effect.runPromise)

    assert.strictEqual(response.reasoningText, "2 + 2 means adding two and two.")
    assert.strictEqual(response.text, "The answer is 4.")
  })

  it("streams text deltas through the openai-chat adapter when enabled", async () => {
    const { requests, layer: fetchLayer } = sseFetch([
      `{"id":"c1","model":"test-model","choices":[{"index":0,"delta":{"role":"assistant","content":"Hel"}}]}`,
      `{"id":"c1","choices":[{"index":0,"delta":{"content":"lo"}}]}`,
      `{"id":"c1","choices":[{"index":0,"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":1,"completion_tokens":2}}`,
    ])
    const layer = openAiStreamingLayer.pipe(Layer.provide(fetchLayer))

    const parts = await LanguageModel.streamText({ prompt: "hi" }).pipe(
      Stream.runCollect,
      Effect.provide(layer),
      Effect.runPromise,
    )

    assert.strictEqual(requests[0].stream, true)
    const partList = Array.from(parts)
    const text = partList
      .filter((part) => part.type === "text-delta")
      .map((part) => part.delta)
      .join("")
    assert.strictEqual(text, "Hello")
    const finish = partList.find((part) => part.type === "finish")
    assert.strictEqual(finish?.reason, "stop")
  })

  it("accumulates streamed tool-call deltas into tool calls", async () => {
    const { layer: fetchLayer } = sseFetch([
      `{"id":"c1","model":"test-model","choices":[{"index":0,"delta":{"role":"assistant","tool_calls":[{"index":0,"id":"call_1","type":"function","function":{"name":"get_weather","arguments":""}}]}}]}`,
      `{"id":"c1","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"{\\"city\\":"}}]}}]}`,
      `{"id":"c1","choices":[{"index":0,"delta":{"tool_calls":[{"index":0,"function":{"arguments":"\\"Tokyo\\"}"}}]}}]}`,
      `{"id":"c1","choices":[{"index":0,"delta":{},"finish_reason":"tool_calls"}]}`,
    ])
    const layer = openAiStreamingLayer.pipe(Layer.provide(fetchLayer))

    const parts = await LanguageModel.streamText({
      prompt: "What's the weather in Tokyo?",
      toolkit: WeatherToolkit,
      disableToolCallResolution: true,
    }).pipe(Stream.runCollect, Effect.provide(layer), Effect.runPromise)

    const partList = Array.from(parts)
    const toolCall = partList.find((part) => part.type === "tool-call")
    assert.strictEqual(toolCall?.id, "call_1")
    assert.strictEqual(toolCall?.name, "get_weather")
    assert.deepStrictEqual(toolCall?.params, { city: "Tokyo" })
    const finish = partList.find((part) => part.type === "finish")
    assert.strictEqual(finish?.reason, "tool-calls")
  })

  it("requests streamed usage and captures it from the trailing usage chunk", async () => {
    const { requests, layer: fetchLayer } = sseFetch([
      `{"id":"c1","model":"test-model","choices":[{"index":0,"delta":{"role":"assistant","content":"Hi"}}]}`,
      `{"id":"c1","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}`,
      `{"id":"c1","choices":[],"usage":{"prompt_tokens":3,"completion_tokens":5}}`,
    ])
    const layer = openAiStreamingLayer.pipe(Layer.provide(fetchLayer))

    const parts = await LanguageModel.streamText({ prompt: "hi" }).pipe(
      Stream.runCollect,
      Effect.provide(layer),
      Effect.runPromise,
    )

    assert.deepStrictEqual(requests[0].stream_options, { include_usage: true })
    const finish = Array.from(parts).find((part) => part.type === "finish")
    assert.strictEqual(finish?.reason, "stop")
    assert.strictEqual(finish?.usage.inputTokens.total, 3)
    assert.strictEqual(finish?.usage.outputTokens.total, 5)
  })

  it("parses SSE events without a space after the data colon", async () => {
    // raw body on purpose: the spec-legal `data:`-without-space framing is
    // exactly what is under test
    const sseBody = [
      `data:{"id":"c1","model":"test-model","choices":[{"index":0,"delta":{"role":"assistant","content":"Hi"}}]}`,
      ``,
      `data:{"id":"c1","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}`,
      ``,
      `data:[DONE]`,
      ``,
    ].join("\n")
    const rawSseFetch: typeof globalThis.fetch = async () =>
      new Response(sseBody, { status: 200, headers: { "content-type": "text/event-stream" } })
    const layer = openAiStreamingLayer.pipe(Layer.provide(Layer.succeed(FetchHttpClient.Fetch, rawSseFetch)))

    const parts = await LanguageModel.streamText({ prompt: "hi" }).pipe(
      Stream.runCollect,
      Effect.provide(layer),
      Effect.runPromise,
    )

    const partList = Array.from(parts)
    const text = partList
      .filter((part) => part.type === "text-delta")
      .map((part) => part.delta)
      .join("")
    assert.strictEqual(text, "Hi")
    const finish = partList.find((part) => part.type === "finish")
    assert.strictEqual(finish?.reason, "stop")
  })

  it("surfaces HTTP error statuses from generateText as status-based errors", async () => {
    const layer = openAiChatLayer.pipe(Layer.provide(Layer.succeed(FetchHttpClient.Fetch, errorFetch(429))))
    const error = await LanguageModel.generateText({ prompt: "hi" }).pipe(
      Effect.flip,
      Effect.provide(layer),
      Effect.runPromise,
    )
    assert.isTrue(AiError.isAiError(error))
    assert.strictEqual(error.reason._tag, "RateLimitError")
  })

  it("fails streaming on HTTP error statuses instead of ending as an empty stream", async () => {
    const layer = openAiStreamingLayer.pipe(Layer.provide(Layer.succeed(FetchHttpClient.Fetch, errorFetch(500))))
    const error = await LanguageModel.streamText({ prompt: "hi" }).pipe(
      Stream.runDrain,
      Effect.flip,
      Effect.provide(layer),
      Effect.runPromise,
    )
    assert.isTrue(AiError.isAiError(error))
    assert.strictEqual(error.reason._tag, "InternalProviderError")
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
