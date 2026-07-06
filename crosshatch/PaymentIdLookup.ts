import { Context, Deferred, Effect, Layer, Schema as S } from "effect"

import type { Payload } from "./Payload.ts"
import { PaymentId } from "./PaymentId.ts"

export class PaymentIdNotFoundError extends S.TaggedErrorClass<PaymentIdNotFoundError>()("PaymentIdNotFoundError", {
  paymentId: PaymentId,
}) {}

export class PaymentIdLookup extends Context.Service<
  PaymentIdLookup,
  {
    readonly await: (paymentId: typeof PaymentId.Type) => Effect.Effect<typeof Payload.Type, PaymentIdNotFoundError>

    readonly resolve: (config: {
      readonly paymentId: typeof PaymentId.Type
      readonly payload: typeof Payload.Type
    }) => Effect.Effect<void, PaymentIdNotFoundError>
  }
>()("crosshatch/PaymentIdLookup") {}

export const layerMemory = Layer.effect(
  PaymentIdLookup,
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
          return yield* new PaymentIdNotFoundError({ paymentId })
        }
        return yield* Deferred.await(invoice)
      }),
      resolve: Effect.fnUntraced(function* ({ paymentId, payload }) {
        const deferred = invoices[paymentId]
        if (!deferred) {
          return yield* new PaymentIdNotFoundError({ paymentId })
        }
        delete invoices[paymentId]
        yield* Deferred.succeed(deferred, payload)
      }),
    }
  }),
)
