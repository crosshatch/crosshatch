import type { Effect, Schema as S } from "effect"
import type { Prompt } from "effect/unstable/ai"

import * as Adapter from "./Adapter.ts"

/**
 * Flattens a structured conversation into the single message string these
 * providers accept.
 */
export const toMessage = (prompt: Prompt.Prompt): string =>
  Adapter.toTextMessages(prompt)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n\n")

/**
 * A `LanguageModel` for providers with a bespoke request/response JSON chat
 * endpoint. See `Adapter.layer` for the payment contract.
 */
export const layer = <W, I>(config: {
  readonly id: string
  readonly apiUrl: string
  readonly endpoint: string
  readonly model: string
  readonly buildRequest: (input: { readonly message: string }) => Effect.Effect<unknown>
  readonly response: {
    readonly schema: S.Codec<W, I>
    readonly message: (response: W) => string
  }
}) =>
  Adapter.layer({
    id: config.id,
    url: `${config.apiUrl}${config.endpoint}`,
    buildRequest: (prompt) => config.buildRequest({ message: toMessage(prompt) }),
    response: {
      schema: config.response.schema,
      toParts: (response) =>
        Adapter.textResponseParts({
          modelId: config.model,
          text: config.response.message(response),
        }),
    },
  })
