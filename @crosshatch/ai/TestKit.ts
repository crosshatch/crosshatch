/**
 * Fetch stubs and wire-format fixtures shared by the adapter and provider
 * test suites. Not part of the public API.
 */
import { Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

/**
 * A fetch stub that captures every request body and replies with the given
 * canned JSON body.
 */
export const capturingFetch = (body: unknown) => {
  const requests: Array<any> = []
  const fetch: typeof globalThis.fetch = async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    requests.push(await request.clone().json())
    return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } })
  }
  return { requests, layer: Layer.succeed(FetchHttpClient.Fetch, fetch) }
}

/**
 * A minimal chat-completions response body around the given message.
 */
export const chatCompletion = (message: unknown, finishReason: string = "stop") => ({
  id: "chatcmpl-test",
  object: "chat.completion",
  created: 1,
  model: "test-model",
  choices: [{ index: 0, message, finish_reason: finishReason }],
  usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
})

/**
 * A fetch stub that captures every request body and replies with the given
 * JSON payloads framed as standard `data: `-prefixed SSE events, terminated
 * by `data: [DONE]`.
 */
export const sseFetch = (events: ReadonlyArray<string>) => {
  const requests: Array<any> = []
  const body = [...events.map((event) => `data: ${event}`), "data: [DONE]", ""].join("\n\n")
  const fetch: typeof globalThis.fetch = async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init)
    requests.push(await request.clone().json())
    return new Response(body, { status: 200, headers: { "content-type": "text/event-stream" } })
  }
  return { requests, layer: Layer.succeed(FetchHttpClient.Fetch, fetch) }
}
