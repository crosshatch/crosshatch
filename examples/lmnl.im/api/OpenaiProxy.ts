import { Headers as Headers_, HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Requirements, Required, Address } from "crosshatch/X402"
import { Config, Effect, Encoding, flow, Option, Redacted, Schema as S, Stream } from "effect"

export const OpenaiProxy = Effect.gen(function* () {
  const { headers: initialHeaders, url, method, stream } = yield* HttpServerRequest.HttpServerRequest
  if (url === "/embeddings" || url === "/responses") {
    const maybePayloadHeader = Option.firstSomeOf([
      Headers_.get(initialHeaders, "X-PAYMENT"),
      Headers_.get(initialHeaders, "PAYMENT-SIGNATURE"),
    ])
    if (Option.isNone(maybePayloadHeader)) {
      const _tag = url === "/embeddings" ? "Embedding" : "Response"
      const requirementHeader = yield* S.validate(Required.Required)(
        Required.make({
          accepts: [
            Requirements.make({
              amount: `${Math.floor(Math.random() * 100000)}`,
              recipient: yield* Config.string("PAY_TO_EVM").pipe(Effect.flatMap(S.decodeUnknown(Address.EvmAddress))),
            }),
          ],
          resource: {
            description: `Generate an OpenAI ${_tag.toLowerCase()}`,
            mimeType: "text/json",
            url: `https://lmnl.im/openai${url}`,
          },
        }),
      ).pipe(Effect.map(flow(JSON.stringify, Encoding.encodeBase64)))
      return yield* HttpServerResponse.raw(undefined, {
        headers: { "PAYMENT-REQUIRED": requirementHeader },
        status: 402,
      })
    }
    // TODO: verify payment
  }
  const runtime = yield* Effect.runtime<never>()
  const headers = new Headers(initialHeaders)
  headers.delete("connection")
  headers.delete("content-encoding")
  headers.delete("content-length")
  headers.delete("host")
  headers.delete("keep-alive")
  headers.delete("proxy-authenticate")
  headers.delete("proxy-authorization")
  headers.delete("te")
  headers.delete("trailer")
  headers.delete("transfer-encoding")
  headers.delete("upgrade")
  headers.set("accept-encoding", "identity")
  headers.set("Authorization", `Bearer ${Redacted.value(yield* Config.redacted("OPENAI_API_KEY"))}`)
  const init: RequestInit = { headers, method }
  if (!["GET", "HEAD"].includes(method)) {
    init.body = Stream.toReadableStreamRuntime(stream, runtime)
    ;(init as any).duplex = "half"
  }
  const upstream = yield* Effect.tryPromise(() =>
    fetch(new Request(new URL(`.${url}`, "https://api.openai.com/v1/"), init)),
  )
  if (upstream.status === 400) {
    console.log(yield* Effect.tryPromise(() => upstream.text()))
  }
  const responseHeaders = new Headers(upstream.headers)
  responseHeaders.delete("content-encoding")
  responseHeaders.delete("content-length")
  responseHeaders.delete("transfer-encoding")
  responseHeaders.delete("connection")
  return yield* HttpServerResponse.fromWeb(
    new Response(upstream.body, {
      headers: responseHeaders,
      status: upstream.status,
      statusText: upstream.statusText,
    }),
  )
})
