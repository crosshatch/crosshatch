import { Generated, OpenAiSchema } from "@effect/ai-openai"
import { Effect, Schema as S } from "effect"
import { HttpClient, HttpClientResponse } from "effect/unstable/http"

export type ResponsesInput = ReadonlyArray<{
  readonly role: string
  readonly content: string | ReadonlyArray<{ readonly text?: string }>
}>

const ChatCompletionJson = S.StructWithRest(
  S.Struct({
    choices: S.optional(
      S.Array(
        S.StructWithRest(
          S.Struct({
            message: S.optional(S.Record(S.String, S.Unknown)),
            logprobs: S.optional(S.Unknown),
          }),
          [S.Record(S.String, S.Unknown)],
        ),
      ),
    ),
  }),
  [S.Record(S.String, S.Unknown)],
)

const readChatCompletionJson = S.decodeUnknownEffect(ChatCompletionJson)

export const toChatMessages = (input: ResponsesInput) =>
  input.map((message) => ({
    role: message.role === "developer" ? "system" : message.role,
    content:
      typeof message.content === "string" ? message.content : message.content.map((part) => part.text ?? "").join(""),
  }))

/**
 * Builds an `OpenAiSchema.Response` (the decoded Responses-API body) from
 * primitive fields. This is the single boundary where the OpenAI Responses-API
 * shape is materialized from provider data.
 */
export const makeResponse = (options: {
  readonly id: string
  readonly created_at: number
  readonly model: string
  readonly text: string
  readonly usage?:
    | {
        readonly input_tokens: number
        readonly output_tokens: number
      }
    | undefined
}): typeof OpenAiSchema.Response.Type => ({
  id: options.id,
  model: options.model,
  created_at: options.created_at,
  output: [
    {
      id: crypto.randomUUID(),
      type: "message",
      role: "assistant",
      status: "completed",
      content: [
        {
          type: "output_text",
          text: options.text,
          annotations: [],
        },
      ],
    },
  ],
  usage: options.usage
    ? {
        input_tokens: options.usage.input_tokens,
        output_tokens: options.usage.output_tokens,
        total_tokens: options.usage.input_tokens + options.usage.output_tokens,
      }
    : null,
})

export const fromChatCompletion = (
  chat: typeof Generated.CreateChatCompletionResponse.Type,
): typeof OpenAiSchema.Response.Type =>
  makeResponse({
    id: chat.id,
    created_at: chat.created,
    model: chat.model,
    text: chat.choices[0]?.message.content ?? "",
    usage: chat.usage && {
      input_tokens: chat.usage.prompt_tokens,
      output_tokens: chat.usage.completion_tokens,
    },
  })

export const patchChatCompletionResponse = HttpClient.transformResponse(
  Effect.flatMap((response) => {
    if (!response.request.url.endsWith("/chat/completions")) {
      return Effect.succeed(response)
    }
    return response.json.pipe(
      Effect.flatMap(readChatCompletionJson),
      Effect.orDie,
      Effect.map((body) => ({
        ...body,
        choices: body.choices?.map((choice) => ({
          logprobs: null,
          ...choice,
          // `refusal` is a required (nullable) field some providers omit; the
          // other message fields are optional and decode fine when absent.
          message: choice.message && {
            refusal: null,
            ...choice.message,
          },
        })),
      })),
      Effect.map((body) =>
        HttpClientResponse.fromWeb(
          response.request,
          new Response(JSON.stringify(body), {
            status: response.status,
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    )
  }),
)
