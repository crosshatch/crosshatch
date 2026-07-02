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
 * The x402 providers only expose request/response endpoints, so streaming is
 * rejected up front instead of silently falling through to an unpaid request
 * against a real upstream endpoint.
 */
const streamingUnsupported = (module: string, method: string): AiError.AiError =>
  AiError.make({
    module,
    method,
    reason: new AiError.InvalidRequestError({
      description: `${module} does not support streaming`,
    }),
  })

const partsToText = (parts: ReadonlyArray<Prompt.UserMessagePart | Prompt.AssistantMessagePart>): string =>
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
 * Assembles the response parts for a completed plain-text reply.
 */
export const textResponseParts = (options: {
  readonly id?: string | undefined
  readonly modelId?: string | undefined
  readonly text: string
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
  { type: "text", text: options.text },
  {
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
  },
]

/**
 * A `LanguageModel` over a single JSON request/response endpoint: build a
 * request body from the prompt, POST it, decode the reply, and surface it as
 * response parts. Streaming is rejected with an `AiError`.
 *
 * Payment is not bundled: provide a paying fetch from the outside, e.g.
 * `layer.pipe(Layer.provide(Headless.layerConfig(mnemonicConfig, KnownAsset)))`.
 * Without one, requests go out unpaid and fail at runtime with a 402.
 */
export const layer = <W, I>(config: {
  readonly id: string
  readonly url: string
  readonly buildRequest: (prompt: Prompt.Prompt) => Effect.Effect<unknown>
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

      const generateText = (options: LanguageModel.ProviderOptions) =>
        Effect.gen(function* () {
          const body = yield* config.buildRequest(options.prompt)
          const response = yield* httpClient.post(config.url, {
            body: HttpBody.jsonUnsafe(body),
          })
          const json = yield* response.json
          const decoded = yield* decode(json)
          return config.response.toParts(decoded)
        }).pipe(Effect.mapError(toAiError(config.id, "generateText")))

      return yield* LanguageModel.make({
        generateText,
        streamText: () => Stream.fail(streamingUnsupported(config.id, "streamText")),
      })
    }),
  ).pipe(Layer.provide(FetchHttpClient.layer))
