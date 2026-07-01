import { Context, Deferred, Effect, Layer, Schema as S } from "effect"

import * as Extension from "./Extension.ts"
import type { Payload } from "./Payload.ts"

export const PaymentId = S.String.check(S.isLengthBetween(16, 128), S.isPattern(/^[a-zA-Z0-9_-]+$/)).pipe(
  S.brand("crosshatch/PaymentId"),
)

export const PaymentIdExtension = Extension.make("payment-identifier", {
  payload: S.Struct({
    required: S.Boolean,
    id: PaymentId.pipe(S.optional),
  }),
  success: S.Union([
    S.Struct({
      required: S.tag(true),
      id: PaymentId,
    }),
    S.Struct({
      required: S.tag(false),
      id: S.Never.pipe(S.optional),
    }),
  ]),
})

export class NoSuchPaymentError extends S.TaggedErrorClass<NoSuchPaymentError>()("NoSuchPaymentError", {
  paymentId: PaymentId,
}) {}

export class Lookup extends Context.Service<
  Lookup,
  {
    readonly make: Effect.Effect<typeof PaymentId.Type>

    readonly await: (paymentId: typeof PaymentId.Type) => Effect.Effect<typeof Payload.Type, NoSuchPaymentError>

    readonly resolve: (config: {
      readonly paymentId: typeof PaymentId.Type
      readonly payload: typeof Payload.Type
    }) => Effect.Effect<void, NoSuchPaymentError>
  }
>()("crosshatch/PaymentId/Lookup") {}

export const deferred = Effect.fnUntraced(function* (lookup: Lookup["Service"]) {
  const paymentId = yield* lookup.make
  const payloadFiber = yield* lookup.await(paymentId).pipe(Effect.forkChild)
  return [paymentId, payloadFiber] as const
})

export const layerMemory = Layer.effect(
  Lookup,
  Effect.sync(() => {
    const invoices: Record<typeof PaymentId.Type, Deferred.Deferred<typeof Payload.Type>> = {}
    return {
      make: Effect.gen(function* () {
        const deferred = yield* Deferred.make<typeof Payload.Type>()
        const paymentId = PaymentId.make(crypto.randomUUID())
        invoices[paymentId] = deferred
        return paymentId
      }),
      await: Effect.fnUntraced(function* (paymentId) {
        const invoice = invoices[paymentId]
        if (!invoice) {
          return yield* new NoSuchPaymentError({ paymentId })
        }
        return yield* Deferred.await(invoice)
      }),
      resolve: Effect.fnUntraced(function* ({ paymentId, payload }) {
        const deferred = invoices[paymentId]
        if (!deferred) {
          return yield* new NoSuchPaymentError({ paymentId })
        }
        delete invoices[paymentId]
        yield* Deferred.succeed(deferred, payload)
      }),
    }
  }),
)
