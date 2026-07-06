import { Context, Schema as S, Effect, Option, Layer } from "effect"
import { Headers, HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/unstable/http"

import { TraceId } from "../Bridge.ts"
import type { Extension } from "../Extension.ts"
import { SettleResponse, SettleResponseFromBase64JsonString } from "../Facilitator/endpoints/SettleEndpoint.ts"
import { Payload, PayloadFromBase64JsonString } from "../Payload.ts"
import { Required, RequiredFromBase64JsonString } from "../Required.ts"
import { PAYMENT_REQUIRED, CROSSHATCH_TRACE_ID, PAYMENT_SIGNATURE, PAYMENT_RESPONSE } from "./constants.ts"

export class ResolvedPayload extends Context.Service<ResolvedPayload, typeof Payload.Type | undefined>()(
  "crosshatch/Http402/ResolvedPayload",
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

export const addResponseHeader =
  (settlement: typeof SettleResponse.Type) => (response: HttpServerResponse.HttpServerResponse) =>
    S.encodeEffect(SettleResponseFromBase64JsonString)(settlement).pipe(
      Effect.map((v) => HttpServerResponse.setHeader(PAYMENT_RESPONSE, v)(response)),
    )

export const layerMiddleware = <X extends ReadonlyArray<Extension.Any>>(
  config?: { readonly extensions: X } | undefined,
) =>
  HttpRouter.middleware<{ readonly provides: ResolvedPayload | InstanceType<X[number]> }>()(
    (httpEffect) =>
      Effect.gen(function* () {
        const { headers } = yield* HttpServerRequest.HttpServerRequest
        const payload = Headers.get(PAYMENT_SIGNATURE)(headers).pipe(
          Option.flatMap(S.decodeUnknownOption(PayloadFromBase64JsonString)),
          Option.getOrUndefined,
        )
        const Live = Layer.mergeAll(
          Layer.succeed(ResolvedPayload, payload),
          ...(config?.extensions?.map((v) => v.layer({ payload })) ?? []),
        ) as Layer.Layer<X[number] | ResolvedPayload, S.SchemaError>
        return yield* Effect.provide(httpEffect, Live)
      }),
    { global: true },
  )
