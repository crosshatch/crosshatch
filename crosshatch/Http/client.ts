import { Effect, Schema as S, Layer, Data, Option } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import { Payer } from "../Payer.ts"
import { PayloadFromBase64JsonString } from "../Payload.ts"
import { RequiredFromBase64JsonString } from "../Required.ts"
import { runtime } from "../runtime.ts"
import { CROSSHATCH_TRACE_ID, PAYMENT_REQUIRED, PAYMENT_SIGNATURE } from "./constants.ts"

export class PaymentAlreadyAttemptedError extends Data.TaggedError("PaymentAlreadyAttemptedError")<{}> {}

export class NoSuchRequiredError extends Data.TaggedError("NoSuchRequiredError")<{}> {}

export const layerFetch = Effect.gen(function* () {
  const payer = yield* Payer
  const fetch = yield* Effect.serviceOption(FetchHttpClient.Fetch).pipe(
    Effect.map(Option.getOrElse(() => globalThis.fetch)),
  )
  return ((input, init) =>
    Effect.gen(function* () {
      const request = new Request(input, init)
      const retry = request.clone()
      const response = yield* Effect.promise(() => fetch(request))
      if (response.status !== 402) {
        return response
      }
      if (retry.headers.has(PAYMENT_SIGNATURE)) {
        throw new PaymentAlreadyAttemptedError()
      }
      const requiredHeader = response.headers.get(PAYMENT_REQUIRED)
      if (!requiredHeader) {
        return yield* new NoSuchRequiredError()
      }
      const required = yield* S.decodeUnknownEffect(RequiredFromBase64JsonString)(requiredHeader)
      const traceId = response.headers.get(CROSSHATCH_TRACE_ID) ?? undefined
      const { payload } = yield* payer.createPayload({ required, traceId })
      const encoded = yield* S.encodeEffect(PayloadFromBase64JsonString)(payload)
      retry.headers.set(PAYMENT_SIGNATURE, encoded)
      return yield* Effect.promise(() => fetch(retry))
    }).pipe((effect) =>
      runtime.runPromise(effect, {
        signal: init?.signal ?? undefined,
      }),
    )) satisfies typeof globalThis.fetch
}).pipe(Layer.effect(FetchHttpClient.Fetch))

export const layerClient = FetchHttpClient.layer.pipe(Layer.provide(layerFetch))
