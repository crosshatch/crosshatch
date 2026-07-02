/**
 * OpenAI has two wire protocols: the legacy `/chat/completions` endpoint and
 * the newer Responses API (`/v1/responses`). The x402 providers implement the
 * legacy one, so this adapter speaks it directly. `@effect/ai-openai` is not
 * reused on purpose: its `LanguageModel` is built on the Responses API, and
 * driving it here meant patching non-conformant provider replies and
 * fabricating fake Responses-API bodies just to have the library parse back
 * text we already held.
 */
import { Effect, Schema as S } from "effect"
import type { Response } from "effect/unstable/ai"

import * as Adapter from "./Adapter.ts"

// Only the fields we read; providers differ in which optional OpenAI fields
// they include, so everything else is ignored.
const ChatCompletion = S.Struct({
  id: S.optional(S.String),
  model: S.optional(S.String),
  choices: S.Array(
    S.Struct({
      message: S.Struct({
        content: S.optional(S.NullOr(S.String)),
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
}) =>
  Adapter.layer({
    id: config.id,
    url: `${config.apiUrl}/chat/completions`,
    buildRequest: (prompt) =>
      Effect.succeed({
        model: config.model,
        max_tokens: config.maxTokens,
        messages: Adapter.toTextMessages(prompt),
      }),
    response: {
      schema: ChatCompletion,
      toParts: (chat) => {
        const choice = chat.choices[0]
        return Adapter.textResponseParts({
          id: chat.id,
          modelId: chat.model ?? config.model,
          text: choice?.message.content ?? "",
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
