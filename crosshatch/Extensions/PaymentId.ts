import { Schema as S, Cause, Context, Deferred, Effect, Layer } from "effect"

import { Extension, Payload } from "../index.ts"

export const PaymentId = S.String.check(S.isLengthBetween(16, 128), S.isPattern(/^[a-zA-Z0-9_-]+$/u)).pipe(
  S.brand("crosshatch/PaymentId"),
)

export class PaymentIdExtension extends Extension.Service<PaymentIdExtension>()("crosshatch/PaymentIdExtension", {
  identifier: "payment-identifier",
  info: S.Struct({
    required: S.Boolean,
    id: PaymentId.pipe(S.optional),
  }),
  echo: S.Struct({
    required: S.Boolean,
    id: PaymentId.pipe(S.optional),
  }),
}) {
  static readonly ensureId = Effect.flatMap(this.ensure, ({ id }) => Effect.fromNullishOr(id))
}

export class Payments extends Context.Service<
  Payments,
  {
    readonly make: Effect.Effect<typeof PaymentId.Type>

    readonly await: (paymentId: typeof PaymentId.Type) => Effect.Effect<Payload.Payload, Cause.NoSuchElementError>

    readonly resolve: (config: {
      readonly paymentId: typeof PaymentId.Type
      readonly payload: Payload.Payload
    }) => Effect.Effect<void, Cause.NoSuchElementError>
  }
>()("crosshatch/Payments") {}

export const layerMemory = Layer.effect(
  Payments,
  Effect.sync(() => {
    const invoices: Record<typeof PaymentId.Type, Deferred.Deferred<Payload.Payload>> = {}
    return {
      make: Effect.gen(function* () {
        const deferred = yield* Deferred.make<Payload.Payload>()
        const paymentId = PaymentId.make(crypto.randomUUID())
        invoices[paymentId] = deferred
        return paymentId
      }),
      await: Effect.fnUntraced(function* (paymentId) {
        const invoice = invoices[paymentId]
        if (!invoice) {
          return yield* new Cause.NoSuchElementError()
        }
        return yield* Deferred.await(invoice)
      }),
      resolve: Effect.fnUntraced(function* ({ paymentId, payload }) {
        const deferred = invoices[paymentId]
        if (!deferred) {
          return yield* new Cause.NoSuchElementError()
        }
        delete invoices[paymentId]
        return yield* Deferred.succeed(deferred, payload)
      }),
    }
  }),
)
