import { Effect, type Schema as S } from "effect"
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
 * A `LanguageModel` for providers whose JSON chat endpoint exchanges a single
 * message string each way. See `Adapter.layer` for the payment contract.
 */
export const layer = <W, I>(config: {
  readonly id: string
  readonly url: string
  readonly model: string
  readonly request: (message: string) => unknown
  readonly response: {
    readonly schema: S.Codec<W, I>
    readonly message: (response: W) => string
  }
}) =>
  Adapter.layer({
    id: config.id,
    url: config.url,
    buildRequest: (options) => Effect.succeed(config.request(toMessage(options.prompt))),
    response: {
      schema: config.response.schema,
      toParts: (response) =>
        Adapter.textResponseParts({
          modelId: config.model,
          text: config.response.message(response),
        }),
    },
  })
