import { Payload as X402Payload, Required } from "@crosshatch/x402"
import { Trace } from "crosshatch"
import { Context, Schema as S, Effect, flow, Option } from "effect"
import { HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/unstable/http"

export const PAYMENT_REQUIRED = "payment-required"
export const CROSSHATCH_TRACE_ID = "x-crosshatch-trace-id"
export const EXPOSED_HEADERS = [PAYMENT_REQUIRED, CROSSHATCH_TRACE_ID]

export class Payload extends Context.Service<Payload, typeof X402Payload.Payload.Type | undefined>()(
  "@crosshatch/merchant/Http402/Payload",
) {}

export const require = Effect.fnUntraced(function* (required: typeof Required.Required.Type) {
  const traceId = yield* Effect.serviceOption(Trace).pipe(
    Effect.map(
      flow(
        Option.map(({ traceId }) => traceId),
        Option.getOrUndefined,
      ),
    ),
  )
  const paymentRequired = yield* S.encodeEffect(Required.RequiredFromBase64JsonString)(required)
  return HttpServerResponse.empty({
    headers: {
      [PAYMENT_REQUIRED]: paymentRequired,
      [CROSSHATCH_TRACE_ID]: traceId,
    },
  })
})

export const layer = HttpRouter.middleware<{ readonly provides: Payload }>()(
  (httpEffect) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      const header = request.headers["payment-signature"] ?? request.headers["x-payment"]
      const payload =
        header === undefined
          ? undefined
          : yield* Effect.matchEffect(
              S.decodeUnknownEffect(
                S.StringFromBase64.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(X402Payload.Payload)))),
              )(header),
              {
                onFailure: () => Effect.succeed(undefined),
                onSuccess: Effect.succeed,
              },
            )
      return yield* Effect.provideService(httpEffect, Payload, payload)
    }),
  { global: true },
)
