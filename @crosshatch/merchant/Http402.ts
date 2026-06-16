import { PaymentSpec, Amount } from "@crosshatch/assets"
import { Payload as X402Payload, Required } from "@crosshatch/x402"
import { required } from "crosshatch"
import { Context, Schema as S, Effect, flow, Option, String } from "effect"
import { HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/unstable/http"

import { Merchant } from "./Merchant.ts"
import { Trace } from "./Trace.ts"

export class Payload extends Context.Service<Payload, typeof X402Payload.Payload.Type | undefined>()(
  "@crosshatch/merchant/Http402/Payload",
) {}

export const require = (paymentSpec: PaymentSpec.PaymentSpec) =>
  Effect.fnUntraced(function* (
    template: TemplateStringsArray,
    ...substitutions: ReadonlyArray<unknown>
  ): Effect.fn.Return<
    HttpServerResponse.HttpServerResponse,
    Amount.InvalidUsdError | PaymentSpec.InvalidPaymentSpecError | S.SchemaError,
    Merchant
  > {
    const { amount, asset } = yield* PaymentSpec.unwrap(paymentSpec)
    const traceId = yield* Effect.serviceOption(Trace).pipe(
      Effect.map(
        flow(
          Option.map(({ traceId }) => traceId),
          Option.getOrUndefined,
        ),
      ),
    )
    const { url, pot } = yield* Merchant
    const paymentRequired = yield* S.encodeEffect(
      S.StringFromBase64.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(Required.Required)))),
    )(
      required({
        url,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
        amount,
        recipient: pot,
        asset,
      }),
    )
    return HttpServerResponse.empty({
      headers: {
        "payment-required": paymentRequired,
        "x-crosshatch-trace-id": traceId,
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

export const EXPOSED_HEADERS = ["payment-required", "x-crosshatch-trace-id"]
