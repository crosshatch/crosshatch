/**
 * OpenAI has two wire protocols: the legacy `/chat/completions` endpoint and
 * the newer Responses API (`/v1/responses`). The x402 providers implement the
 * legacy one, so this adapter speaks it directly. `@effect/ai-openai` is not
 * reused on purpose: its `LanguageModel` is built on the Responses API, and
 * driving it here meant patching non-conformant provider replies and
 * fabricating fake Responses-API bodies just to have the library parse back
 * text we already held.
 */
import { Effect, Schema as S, Stream } from "effect"
import { OpenAiStructuredOutput, Tool, type LanguageModel, type Prompt, type Response } from "effect/unstable/ai"
import { HttpBody, type HttpClient, type HttpClientError } from "effect/unstable/http"

import * as Adapter from "./Adapter.ts"

type ChatMessage =
  | { readonly role: "system" | "user"; readonly content: string }
  | {
      readonly role: "assistant"
      readonly content: string | null
      readonly tool_calls?: ReadonlyArray<{
        readonly id: string
        readonly type: "function"
        readonly function: { readonly name: string; readonly arguments: string }
      }>
    }
  | { readonly role: "tool"; readonly tool_call_id: string; readonly content: string }

/**
 * Serializes a structured conversation to chat-completions messages,
 * preserving tool calls and tool results.
 */
export const toChatMessages = (prompt: Prompt.Prompt): Array<ChatMessage> =>
  prompt.content.flatMap((message): Array<ChatMessage> => {
    switch (message.role) {
      case "system":
        return [{ role: "system", content: message.content }]
      case "user":
        return [{ role: "user", content: Adapter.partsToText(message.content) }]
      case "assistant": {
        const text = Adapter.partsToText(message.content)
        const toolCalls = message.content
          .filter((part) => part.type === "tool-call")
          .map((part) => ({
            id: part.id,
            type: "function" as const,
            function: { name: part.name, arguments: JSON.stringify(part.params) },
          }))
        return [
          {
            role: "assistant",
            content: text.length > 0 ? text : null,
            ...(toolCalls.length > 0 && { tool_calls: toolCalls }),
          },
        ]
      }
      case "tool":
        return message.content
          .filter((part) => part.type === "tool-result")
          .map((part) => ({
            role: "tool",
            tool_call_id: part.id,
            content: JSON.stringify(part.result),
          }))
    }
  })

// Only the fields we read; providers differ in which optional OpenAI fields
// they include, so everything else is ignored.
const ChatCompletion = S.Struct({
  id: S.optional(S.String),
  model: S.optional(S.String),
  choices: S.Array(
    S.Struct({
      message: S.Struct({
        content: S.optional(S.NullOr(S.String)),
        reasoning_content: S.optional(S.NullOr(S.String)),
        tool_calls: S.optional(
          S.NullOr(
            S.Array(
              S.Struct({
                id: S.String,
                function: S.Struct({
                  name: S.String,
                  arguments: S.UnknownFromJsonString,
                }),
              }),
            ),
          ),
        ),
      }),
      finish_reason: S.optional(S.NullOr(S.String)),
    }),
  ),
  usage: S.optional(
    S.NullOr(
      S.Struct({
        prompt_tokens: S.Number,
        completion_tokens: S.Number,
      }),
    ),
  ),
})

const toTool = (tool: Tool.Any) => ({
  type: "function",
  function: {
    name: tool.name,
    description: tool.description,
    parameters: Tool.getJsonSchema(tool),
  },
})

// The `oneOf` restriction has no chat-completions equivalent, so it degrades
// to its `mode`.
const toToolChoice = (choice: LanguageModel.ProviderOptions["toolChoice"]) => {
  if (typeof choice === "string") return choice
  if ("tool" in choice) return { type: "function", function: { name: choice.tool } }
  return choice.mode ?? "auto"
}

// Tool-call deltas are not accumulated: streamed tool calling is untested on
// the x402 providers, so those chunks are ignored rather than half-decoded.
const ChatCompletionChunk = S.Struct({
  id: S.optional(S.String),
  model: S.optional(S.String),
  choices: S.Array(
    S.Struct({
      delta: S.optional(
        S.Struct({
          content: S.optional(S.NullOr(S.String)),
          reasoning_content: S.optional(S.NullOr(S.String)),
        }),
      ),
      finish_reason: S.optional(S.NullOr(S.String)),
    }),
  ),
  usage: S.optional(
    S.NullOr(
      S.Struct({
        prompt_tokens: S.Number,
        completion_tokens: S.Number,
      }),
    ),
  ),
})

const decodeChunk = S.decodeUnknownEffect(S.fromJsonString(ChatCompletionChunk))

const DATA_PREFIX = "data: "

const streamChat = (
  url: string,
  body: unknown,
  httpClient: HttpClient.HttpClient,
): Stream.Stream<Response.StreamPartEncoded, S.SchemaError | HttpClientError.HttpClientError> =>
  Stream.unwrap(
    Effect.map(httpClient.post(url, { body: HttpBody.jsonUnsafe(body) }), (response) => {
      let metadataEmitted = false
      let reasoningOpen = false
      let textOpen = false
      return response.stream.pipe(
        Stream.decodeText(),
        Stream.splitLines,
        Stream.filter((line) => line.startsWith(DATA_PREFIX) && line !== `${DATA_PREFIX}[DONE]`),
        Stream.mapEffect((line) => decodeChunk(line.slice(DATA_PREFIX.length))),
        Stream.flatMap((chunk) => {
          const parts: Array<Response.StreamPartEncoded> = []
          const choice = chunk.choices[0]
          if (!metadataEmitted && (chunk.id !== undefined || chunk.model !== undefined)) {
            metadataEmitted = true
            parts.push({
              type: "response-metadata",
              id: chunk.id,
              modelId: chunk.model,
              timestamp: undefined,
              request: undefined,
            })
          }
          const reasoningDelta = choice?.delta?.reasoning_content
          if (reasoningDelta != null && reasoningDelta.length > 0) {
            if (!reasoningOpen) {
              reasoningOpen = true
              parts.push({ type: "reasoning-start", id: "reasoning-1" })
            }
            parts.push({ type: "reasoning-delta", id: "reasoning-1", delta: reasoningDelta })
          }
          const textDelta = choice?.delta?.content
          if (textDelta != null && textDelta.length > 0) {
            if (reasoningOpen) {
              reasoningOpen = false
              parts.push({ type: "reasoning-end", id: "reasoning-1" })
            }
            if (!textOpen) {
              textOpen = true
              parts.push({ type: "text-start", id: "text-1" })
            }
            parts.push({ type: "text-delta", id: "text-1", delta: textDelta })
          }
          if (choice?.finish_reason != null) {
            if (reasoningOpen) {
              reasoningOpen = false
              parts.push({ type: "reasoning-end", id: "reasoning-1" })
            }
            if (textOpen) {
              textOpen = false
              parts.push({ type: "text-end", id: "text-1" })
            }
            parts.push(
              Adapter.finishPart({
                finishReason: toFinishReason(choice.finish_reason),
                usage: chunk.usage
                  ? {
                      inputTokens: chunk.usage.prompt_tokens,
                      outputTokens: chunk.usage.completion_tokens,
                    }
                  : undefined,
              }),
            )
          }
          return Stream.fromIterable(parts)
        }),
      )
    }),
  )

const toFinishReason = (reason: string | null | undefined): Response.FinishReason => {
  switch (reason) {
    case "stop":
      return "stop"
    case "length":
      return "length"
    case "content_filter":
      return "content-filter"
    case "tool_calls":
      return "tool-calls"
    default:
      return "unknown"
  }
}

/**
 * A `LanguageModel` for providers that speak the OpenAI chat-completions
 * protocol. See `Adapter.layer` for the payment contract.
 */
export const layer = (config: {
  readonly id: string
  readonly apiUrl: string
  readonly model: string
  readonly maxTokens: number
  readonly temperature?: number | undefined
  readonly topP?: number | undefined
  readonly stop?: ReadonlyArray<string> | undefined
  readonly extraBody?: Readonly<Record<string, unknown>> | undefined
  readonly streaming?: boolean | undefined
}) => {
  const url = `${config.apiUrl}/chat/completions`
  const buildBody = (options: LanguageModel.ProviderOptions) => ({
    model: config.model,
    max_tokens: config.maxTokens,
    ...(config.temperature !== undefined && { temperature: config.temperature }),
    ...(config.topP !== undefined && { top_p: config.topP }),
    ...(config.stop !== undefined && { stop: config.stop }),
    ...config.extraBody,
    messages: toChatMessages(options.prompt),
    ...(options.tools.length > 0 && {
      tools: options.tools.map(toTool),
      tool_choice: toToolChoice(options.toolChoice),
    }),
    ...(options.responseFormat.type === "json" && {
      response_format: {
        type: "json_schema",
        json_schema: {
          name: options.responseFormat.objectName,
          strict: true,
          schema: Tool.getJsonSchemaFromSchema(options.responseFormat.schema as S.Constraint, {
            transformer: OpenAiStructuredOutput.toCodecOpenAI,
          }),
        },
      },
    }),
  })
  return Adapter.layer({
    id: config.id,
    url,
    buildRequest: (options) => Effect.succeed(buildBody(options)),
    ...(config.streaming && {
      streamText: (options: LanguageModel.ProviderOptions, httpClient: HttpClient.HttpClient) =>
        streamChat(url, { ...buildBody(options), stream: true }, httpClient),
    }),
    codecTransformer: OpenAiStructuredOutput.toCodecOpenAI,
    response: {
      schema: ChatCompletion,
      toParts: (chat) => {
        const choice = chat.choices[0]
        return Adapter.textResponseParts({
          id: chat.id,
          modelId: chat.model ?? config.model,
          reasoning: choice?.message.reasoning_content ?? undefined,
          text: choice?.message.content ?? "",
          toolCalls: choice?.message.tool_calls?.map((call) => ({
            id: call.id,
            name: call.function.name,
            params: call.function.arguments,
          })),
          finishReason: toFinishReason(choice?.finish_reason),
          usage: chat.usage
            ? {
                inputTokens: chat.usage.prompt_tokens,
                outputTokens: chat.usage.completion_tokens,
              }
            : undefined,
        })
      },
    },
  })
}
