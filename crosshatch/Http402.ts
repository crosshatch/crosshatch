import { Context, Schema as S, Effect, Option } from "effect"
import { HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/unstable/http"

import { Payload } from "./Payload.ts"
import { Required, RequiredFromBase64JsonString } from "./Required.ts"
import { TraceId } from "./traced.ts"

export const PAYMENT_REQUIRED = "payment-required" as const

export const CROSSHATCH_TRACE_ID = "x-crosshatch-trace-id" as const

export const EXPOSED_HEADERS = [PAYMENT_REQUIRED, CROSSHATCH_TRACE_ID] as const

export class Http402Payload extends Context.Service<Http402Payload, typeof Payload.Type | undefined>()(
  "crosshatch/http/Http402/Payload",
) {}

export const require = Effect.fnUntraced(function* ({ required }: { readonly required: typeof Required.Type }) {
  const traceId = yield* TraceId
  const paymentRequired = yield* S.encodeEffect(RequiredFromBase64JsonString)(required)
  return HttpServerResponse.empty({
    headers: {
      [PAYMENT_REQUIRED]: paymentRequired,
      ...(traceId && { [CROSSHATCH_TRACE_ID]: traceId }),
    },
  })
})

export const layer = HttpRouter.middleware<{ readonly provides: Http402Payload }>()(
  (httpEffect) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      const header = request.headers["payment-signature"] ?? request.headers["x-payment"]
      const payload =
        header === undefined
          ? undefined
          : S.decodeUnknownOption(S.StringFromBase64.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(Payload)))))(
              header,
            ).pipe(Option.getOrUndefined)
      return yield* Effect.provideService(httpEffect, Http402Payload, payload)
    }),
  { global: true },
)
