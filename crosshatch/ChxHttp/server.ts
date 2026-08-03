import { Struct, Schema as S, Effect, Option, Layer, Data, ErrorReporter } from "effect"
import { Headers, HttpRouter, HttpServerRequest, HttpServerResponse, HttpServerRespondable } from "effect/unstable/http"

import * as Extension from "../Extension.ts"
import { SettleResponseFromBase64JsonString, type SettleResponse } from "../FacilitatorApi/index.ts"
import { Payload, PayloadFromBase64JsonString } from "../Payload.ts"
import { type Required, RequiredFromBase64JsonString } from "../Required.ts"
import { PAYMENT_REQUIRED, CROSSHATCH_TRACE_ID, PAYMENT_SIGNATURE, PAYMENT_RESPONSE } from "./constants.ts"

export class PaymentRequired
  extends Data.TaggedError("PaymentRequired")<{
    readonly required: Required
    readonly request: HttpServerRequest.HttpServerRequest
  }>
  implements HttpServerRespondable.Respondable
{
  [HttpServerRespondable.symbol]() {
    return Effect.gen({ self: this }, function* () {
      const traceId = yield* Effect.currentSpan.pipe(
        Effect.map(Struct.get("traceId")),
        Effect.catchTags({
          NoSuchElementError: () => Effect.undefined,
        }),
      )
      const paymentRequired = yield* S.encodeEffect(RequiredFromBase64JsonString)(this.required)
      return HttpServerResponse.empty({
        status: 404,
        headers: {
          ...(traceId && { [CROSSHATCH_TRACE_ID]: traceId }),
          [PAYMENT_REQUIRED]: paymentRequired,
        },
      })
    })
  }

  override readonly [ErrorReporter.ignore] = true

  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`
  }

  override get message() {
    return `${this._tag} (${this.methodAndUrl}): retry with an attached x402 payment payload`
  }
}

export const require = Effect.fnUntraced(function* ({ required }: { readonly required: Required }) {
  const request = yield* HttpServerRequest.HttpServerRequest
  return yield* new PaymentRequired({ request, required })
})

export const addResponseHeader = (settlement: SettleResponse) =>
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
        const layerRequestServices = Layer.mergeAll(
          Layer.succeed(Payload, payload),
          ...(config?.extensions?.map((v) => Extension.layerFromPayload(v, payload)) ?? []),
        ) as Layer.Layer<X[number] | Payload, S.SchemaError>
        return yield* Effect.provide(effect, layerRequestServices)
      }),
    { global: true },
  )
