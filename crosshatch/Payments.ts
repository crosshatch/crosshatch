import { Cause, Context, Deferred, Effect, Layer } from "effect"

import { PaymentId } from "./extensions/PaymentId.ts"
import type { Payload } from "./Payload.ts"

export class Payments extends Context.Service<
  Payments,
  {
    readonly make: Effect.Effect<typeof PaymentId.Type>

    readonly await: (paymentId: typeof PaymentId.Type) => Effect.Effect<typeof Payload.Type, Cause.NoSuchElementError>

    readonly resolve: (config: {
      readonly paymentId: typeof PaymentId.Type
      readonly payload: typeof Payload.Type
    }) => Effect.Effect<void, Cause.NoSuchElementError>
  }
>()("crosshatch/Payments") {}

export const layerMemory = Layer.effect(
  Payments,
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
        yield* Deferred.succeed(deferred, payload)
      }),
    }
  }),
)
