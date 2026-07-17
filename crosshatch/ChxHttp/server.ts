import { Schema as S, Effect, Option, Layer } from "effect"
import { Headers, HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/unstable/http"

import { TraceId } from "../Bridge.ts"
import * as Extension from "../Extension.ts"
import { SettleResponse, SettleResponseFromBase64JsonString } from "../FacilitatorApi/SettleEndpoint.ts"
import { Payload, PayloadFromBase64JsonString } from "../Payload.ts"
import { Required, RequiredFromBase64JsonString } from "../Required.ts"
import { PAYMENT_REQUIRED, CROSSHATCH_TRACE_ID, PAYMENT_SIGNATURE, PAYMENT_RESPONSE } from "./constants.ts"

export const require = Effect.fnUntraced(function* ({ required }: { readonly required: Required }) {
  const traceId = yield* TraceId
  const paymentRequired = yield* S.encodeEffect(RequiredFromBase64JsonString)(required)
  return HttpServerResponse.empty({
    headers: {
      [PAYMENT_REQUIRED]: paymentRequired,
      ...(traceId && { [CROSSHATCH_TRACE_ID]: traceId }),
    },
  })
})

export const addResponseHeader = (settlement: typeof SettleResponse.Type) =>
  HttpServerResponse.setHeader(PAYMENT_RESPONSE, S.encodeSync(SettleResponseFromBase64JsonString)(settlement))

export const layerMiddleware = <X extends ReadonlyArray<Extension.Extension.Any> = []>(
  config?: { readonly extensions: X } | undefined,
) =>
  HttpRouter.middleware<{ readonly provides: Payload | InstanceType<X[number]> }>()(
    (effect) =>
      Effect.gen(function* () {
        const { headers } = yield* HttpServerRequest.HttpServerRequest
        const payload = Headers.get(PAYMENT_SIGNATURE)(headers).pipe(
          Option.flatMap(S.decodeUnknownOption(PayloadFromBase64JsonString)),
          Option.getOrUndefined,
        )
        const Live = Layer.mergeAll(
          Layer.succeed(Payload, payload),
          ...(config?.extensions?.map((v) => Extension.layerPayload(v, payload)) ?? []),
        ) as Layer.Layer<X[number] | Payload, S.SchemaError>
        return yield* Effect.provide(effect, Live)
      }),
    { global: true },
  )
