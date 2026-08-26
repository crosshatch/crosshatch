import { Struct, Schema as S, Effect, Option, Layer, Data, ErrorReporter, flow } from "effect"
import {
  Headers,
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
  HttpServerRespondable,
  FetchHttpClient,
} from "effect/unstable/http"

import * as Extension from "./Extension.ts"
import { SettleResponseFromBase64JsonString, type SettleResponse } from "./FacilitatorApi/index.ts"
import { Payer } from "./Payer.ts"
import { Payload, PayloadFromBase64JsonString } from "./Payload.ts"
import { type Required, RequiredFromBase64JsonString } from "./Required.ts"

export const PAYMENT_REQUIRED = "payment-required" as const
export const PAYMENT_SIGNATURE = "payment-signature" as const
export const PAYMENT_RESPONSE = "payment-response" as const

export const CROSSHATCH_TRACE_ID = "x-crosshatch-trace-id" as const
export const CROSSHATCH_SPAN_ID = "x-crosshatch-span-id" as const

export const exposedHeaders = [PAYMENT_REQUIRED, PAYMENT_RESPONSE, CROSSHATCH_TRACE_ID, CROSSHATCH_SPAN_ID] as const

export class PaymentRequired
  extends Data.TaggedError("PaymentRequired")<{
    readonly required: Required
    readonly request: HttpServerRequest.HttpServerRequest
  }>
  implements HttpServerRespondable.Respondable
{
  [HttpServerRespondable.symbol]() {
    return Effect.gen({ self: this }, function* () {
      const traceInfo = yield* Effect.currentSpan.pipe(
        Effect.map(
          flow(
            Struct.pick(["traceId", "spanId"]),
            Struct.renameKeys({
              traceId: CROSSHATCH_TRACE_ID,
              spanId: CROSSHATCH_SPAN_ID,
            }),
          ),
        ),
        Effect.catchTags({
          NoSuchElementError: () => Effect.undefined,
        }),
      )
      const required = yield* S.encodeEffect(RequiredFromBase64JsonString)(this.required)
      return HttpServerResponse.empty({
        status: 402,
        headers: { [PAYMENT_REQUIRED]: required, ...traceInfo },
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
  HttpRouter.middleware<{ readonly provides: Payload | X[number] }>()(
    (effect) =>
      Effect.gen(function* () {
        const { headers } = yield* HttpServerRequest.HttpServerRequest
        const payload = Headers.get(PAYMENT_SIGNATURE)(headers).pipe(
          Option.flatMap(S.decodeUnknownOption(PayloadFromBase64JsonString)),
          Option.getOrUndefined,
        )
        const layer = Layer.mergeAll(
          Layer.empty,
          // oxlint-disable-next-line effecttsgo/missing-layer-context, effecttsgo/any-unknown-in-error-context
          ...((config?.extensions?.map((v) => Extension.layerFromPayload(v, payload)) ?? []) as never as ReadonlyArray<
            Layer.Layer<never>
          >),
        ).pipe(Layer.provideMerge(Layer.succeed(Payload, payload))) as Layer.Layer<X[number] | Payload, S.SchemaError>
        return yield* effect.pipe(Effect.provide(layer))
      }),
    { global: true },
  )

export class PaymentAlreadyAttemptedError extends Data.TaggedError("PaymentAlreadyAttemptedError") {}

export class NoSuchRequiredError extends Data.TaggedError("NoSuchRequiredError") {}

export const layerFetch = Layer.effect(
  FetchHttpClient.Fetch,
  Effect.gen(function* () {
    const payer = yield* Payer
    const fetch = yield* Effect.serviceOption(FetchHttpClient.Fetch).pipe(
      Effect.map(Option.getOrElse(() => globalThis.fetch)),
    )
    return (input, init) =>
      Effect.gen(function* () {
        const request = new Request(input, init)
        const retry = request.clone()
        const response = yield* Effect.promise(() => fetch(request))
        if (response.status !== 402) {
          return response
        }
        if (retry.headers.has(PAYMENT_SIGNATURE)) {
          return yield* new PaymentAlreadyAttemptedError()
        }
        const spanId = response.headers.get(CROSSHATCH_SPAN_ID)
        const traceId = response.headers.get(CROSSHATCH_TRACE_ID)
        const trace = traceId && spanId ? { spanId, traceId } : undefined
        const requiredHeader = response.headers.get(PAYMENT_REQUIRED)
        if (!requiredHeader) {
          return yield* new NoSuchRequiredError()
        }
        const required = yield* S.decodeEffect(RequiredFromBase64JsonString)(requiredHeader)
        const { payload } = yield* payer.createPayload({ required, trace })
        const encoded = yield* S.encodeEffect(PayloadFromBase64JsonString)(payload)
        retry.headers.set(PAYMENT_SIGNATURE, encoded)
        return yield* Effect.promise(() => fetch(retry))
      }).pipe((effect) =>
        // @effect-diagnostics-next-line runEffectInsideEffect:off
        Effect.runPromise(effect, {
          signal: init?.signal ?? undefined,
        }),
      )
  }),
)

export const layerClient = FetchHttpClient.layer.pipe(Layer.provide(layerFetch))
