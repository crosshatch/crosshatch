import { OpenAiClient, OpenAiClientGenerated } from "@effect/ai-openai"
import { Effect, Layer } from "effect"
import { AiError } from "effect/unstable/ai"
import { FetchHttpClient } from "effect/unstable/http"

import { LanguageModelAdapter } from "./Adapter.ts"
import {
  fromChatCompletion,
  patchChatCompletionResponse,
  toChatMessages,
  type ResponsesInput,
} from "./ChatCompletions.ts"

export const layer = (config: {
  readonly id: string
  readonly apiUrl: string
  readonly model: string
  readonly maxTokens: number
}) =>
  Layer.effect(
    LanguageModelAdapter,
    Effect.gen(function* () {
      const providerClient = yield* OpenAiClientGenerated.make({
        apiUrl: config.apiUrl,
        transformClient: (client) => client.pipe(patchChatCompletionResponse),
      })

      const createResponse: OpenAiClient.Service["createResponse"] = (options) =>
        providerClient
          .createChatCompletion({
            payload: {
              model: options.model ?? config.model,
              max_tokens: config.maxTokens,
              messages: toChatMessages(options.input as unknown as ResponsesInput) as never,
            },
            config: { includeResponse: true },
          })
          .pipe(
            Effect.map(([body, response]) => [fromChatCompletion(body), response] as const),
            Effect.catchTags({
              HttpClientError: (error) => {
                const reason = error.reason
                switch (reason._tag) {
                  case "TransportError":
                  case "EncodeError":
                  case "InvalidUrlError":
                    return Effect.fail(
                      AiError.make({
                        module: config.id,
                        method: "createResponse",
                        reason: AiError.NetworkError.fromRequestError(reason),
                      }),
                    )
                  case "StatusCodeError":
                    return Effect.fail(
                      AiError.make({
                        module: config.id,
                        method: "createResponse",
                        reason: AiError.reasonFromHttpStatus({ status: reason.response.status }),
                      }),
                    )
                  case "DecodeError":
                  case "EmptyBodyError":
                    return Effect.fail(
                      AiError.make({
                        module: config.id,
                        method: "createResponse",
                        reason: new AiError.InvalidOutputError({
                          description: reason.description ?? "Failed to decode response",
                        }),
                      }),
                    )
                }
              },
              SchemaError: (error) =>
                Effect.fail(
                  AiError.make({
                    module: config.id,
                    method: "createResponse",
                    reason: AiError.InvalidOutputError.fromSchemaError(error),
                  }),
                ),
            }),
          )

      return { createResponse }
    }),
  ).pipe(Layer.provide(FetchHttpClient.layer))
