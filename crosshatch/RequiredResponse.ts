import { Schema as S, Effect, Data, ErrorReporter } from "effect"
import {
  HttpServerRequest,
  HttpServerResponse,
  HttpServerRespondable,
  HttpTraceContext,
  Headers,
} from "effect/unstable/http"

import { PAYMENT_REQUIRED } from "./_constants.ts"
import * as Required from "./Required.ts"

export class RequiredResponse
  extends Data.TaggedError("RequiredError")<{
    readonly required: Required.Required
    readonly request: HttpServerRequest.HttpServerRequest
  }>
  implements HttpServerRespondable.Respondable
{
  [HttpServerRespondable.symbol]() {
    return Effect.gen({ self: this }, function* () {
      const encoded = yield* S.encodeEffect(Required.RequiredFromString)(this.required)
      const headers = yield* Effect.currentSpan.pipe(
        Effect.map(HttpTraceContext.toHeaders),
        Effect.catchTags({
          NoSuchElementError: () => Effect.succeed(Headers.empty),
        }),
        Effect.map(Headers.set(PAYMENT_REQUIRED, encoded)),
      )
      return HttpServerResponse.empty({
        status: 402,
        headers,
        statusText: "Payment Required",
      })
    })
  }

  override readonly [ErrorReporter.ignore] = true

  override get message() {
    const {
      _tag,
      request: { method, url },
    } = this
    return `${_tag} (${method} ${url}): retry with an x402 payment payload`
  }
}

export const make: (
  required: Required.Required,
) => Effect.Effect<never, RequiredResponse, HttpServerRequest.HttpServerRequest> = Effect.fnUntraced(
  function* (required) {
    const request = yield* HttpServerRequest.HttpServerRequest
    return yield* new RequiredResponse({ required, request })
  },
)
