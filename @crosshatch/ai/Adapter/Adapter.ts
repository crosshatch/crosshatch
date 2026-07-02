import { Array, Effect, Layer, Result, Schema as S, Stream } from "effect"
import { AiError, LanguageModel, type Prompt, type Response } from "effect/unstable/ai"
import { FetchHttpClient, HttpBody, HttpClient, type HttpClientError } from "effect/unstable/http"

const reasonFromHttpClientError = (reason: HttpClientError.HttpClientErrorReason) => {
  switch (reason._tag) {
    case "TransportError":
    case "EncodeError":
    case "InvalidUrlError":
      return AiError.NetworkError.fromRequestError(reason)
    case "StatusCodeError":
      return AiError.reasonFromHttpStatus({ status: reason.response.status })
    case "DecodeError":
    case "EmptyBodyError":
      return new AiError.InvalidOutputError({ description: reason.description ?? "Failed to decode response" })
  }
}

const toAiError =
  (module: string, method: string) =>
  (error: HttpClientError.HttpClientError | S.SchemaError): AiError.AiError =>
    AiError.make({
      module,
      method,
      reason:
        error._tag === "HttpClientError"
          ? reasonFromHttpClientError(error.reason)
          : AiError.InvalidOutputError.fromSchemaError(error),
    })

/**
 * Providers without a `streamText` implementation reject streaming up front
 * instead of silently falling through to an unpaid request against a real
 * upstream endpoint.
 */
const streamingUnsupported = (module: string, method: string): AiError.AiError =>
  AiError.make({
    module,
    method,
    reason: new AiError.InvalidRequestError({
      description: `${module} does not support streaming`,
    }),
  })

export const partsToText = (parts: ReadonlyArray<Prompt.UserMessagePart | Prompt.AssistantMessagePart>): string =>
  parts.map((part) => (part.type === "text" ? part.text : "")).join("")

/**
 * Reduces a structured conversation to plain-text chat messages, the only
 * shape these providers accept. Tool messages carry no text and are dropped.
 */
export const toTextMessages = (
  prompt: Prompt.Prompt,
): Array<{ readonly role: "system" | "user" | "assistant"; readonly content: string }> =>
  Array.filterMap(prompt.content, (message) => {
    if (message.role === "tool") return Result.failVoid
    const content = typeof message.content === "string" ? message.content : partsToText(message.content)
    return Result.succeed({ role: message.role, content })
  })

/**
 * Assembles the finish part, which the part decoder requires to carry every
 * usage key, undefined values included.
 */
export const finishPart = (options: {
  readonly finishReason?: Response.FinishReason | undefined
  readonly usage?:
    | {
        readonly inputTokens: number
        readonly outputTokens: number
      }
    | undefined
}): Response.FinishPartEncoded => ({
  type: "finish",
  reason: options.finishReason ?? "stop",
  usage: {
    inputTokens: {
      uncached: undefined,
      total: options.usage?.inputTokens,
      cacheRead: undefined,
      cacheWrite: undefined,
    },
    outputTokens: {
      total: options.usage?.outputTokens,
      text: undefined,
      reasoning: undefined,
    },
  },
  response: undefined,
})

/**
 * Assembles the response parts for a completed plain-text reply.
 */
export const textResponseParts = (options: {
  readonly id?: string | undefined
  readonly modelId?: string | undefined
  readonly reasoning?: string | undefined
  readonly text: string
  readonly toolCalls?:
    | ReadonlyArray<{
        readonly id: string
        readonly name: string
        readonly params: unknown
      }>
    | undefined
  readonly finishReason?: Response.FinishReason | undefined
  readonly usage?:
    | {
        readonly inputTokens: number
        readonly outputTokens: number
      }
    | undefined
}): Array<Response.PartEncoded> => [
  // the part decoder requires every key present, undefined values included
  {
    type: "response-metadata",
    id: options.id,
    modelId: options.modelId,
    timestamp: undefined,
    request: undefined,
  },
  ...(options.reasoning !== undefined
    ? [{ type: "reasoning", text: options.reasoning } satisfies Response.PartEncoded]
    : []),
  { type: "text", text: options.text },
  ...(options.toolCalls ?? []).map(
    (call): Response.PartEncoded => ({
      type: "tool-call",
      id: call.id,
      name: call.name,
      params: call.params,
      providerExecuted: false,
    }),
  ),
  finishPart(options),
]

/**
 * A `LanguageModel` over a single JSON request/response endpoint: build a
 * request body from the provider options, POST it, decode the reply, and
 * surface it as response parts. Streaming runs through the optional
 * `streamText` hook and is otherwise rejected with an `AiError`.
 *
 * Payment is not bundled: provide a paying fetch from the outside, e.g.
 * `layer.pipe(Layer.provide(Headless.layerConfig(mnemonicConfig, KnownAsset)))`.
 * Without one, requests go out unpaid and fail at runtime with a 402.
 */
export const layer = <W, I>(config: {
  readonly id: string
  readonly url: string
  readonly buildRequest: (options: LanguageModel.ProviderOptions) => Effect.Effect<unknown>
  readonly codecTransformer?: LanguageModel.CodecTransformer
  readonly streamText?:
    | ((
        options: LanguageModel.ProviderOptions,
        httpClient: HttpClient.HttpClient,
      ) => Stream.Stream<Response.StreamPartEncoded, HttpClientError.HttpClientError | S.SchemaError>)
    | undefined
  readonly response: {
    readonly schema: S.Codec<W, I>
    readonly toParts: (response: W) => Array<Response.PartEncoded>
  }
}) =>
  Layer.effect(
    LanguageModel.LanguageModel,
    Effect.gen(function* () {
      const httpClient = yield* HttpClient.HttpClient
      const decode = S.decodeUnknownEffect(config.response.schema)
      const streamText = config.streamText

      const generateText = (options: LanguageModel.ProviderOptions) =>
        Effect.gen(function* () {
          const body = yield* config.buildRequest(options)
          const response = yield* httpClient.post(config.url, {
            body: HttpBody.jsonUnsafe(body),
          })
          const json = yield* response.json
          const decoded = yield* decode(json)
          return config.response.toParts(decoded)
        }).pipe(Effect.mapError(toAiError(config.id, "generateText")))

      return yield* LanguageModel.make({
        generateText,
        streamText: streamText
          ? (options) =>
              streamText(options, httpClient).pipe(Stream.mapError(toAiError(config.id, "streamText")))
          : () => Stream.fail(streamingUnsupported(config.id, "streamText")),
        codecTransformer: config.codecTransformer,
      })
    }),
  ).pipe(Layer.provide(FetchHttpClient.layer))
