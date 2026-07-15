import { Cause, Context, Deferred, Effect, Layer } from "effect"

import * as Payload from "../Payload.ts"
import type { PaymentId } from "./PaymentId.ts"

export class Invoices extends Context.Service<
  Invoices,
  {
    readonly add: (id: typeof PaymentId.Type) => Effect.Effect<void>

    readonly await: (id: typeof PaymentId.Type) => Effect.Effect<Payload.Payload, Cause.NoSuchElementError>

    readonly resolve: (
      id: typeof PaymentId.Type,
      payload: Payload.Payload,
    ) => Effect.Effect<void, Cause.NoSuchElementError>
  }
>()("crosshatch/ChxRpc/Invoices") {}

export const layerMemory = Layer.effect(
  Invoices,
  Effect.sync(() => {
    const invoices: Record<typeof PaymentId.Type, Deferred.Deferred<Payload.Payload>> = {}
    return {
      add: Effect.fnUntraced(function* (id) {
        const deferred = yield* Deferred.make<Payload.Payload>()
        invoices[id] = deferred
      }),
      await: Effect.fnUntraced(function* (paymentId) {
        const invoice = invoices[paymentId]
        if (!invoice) {
          return yield* new Cause.NoSuchElementError()
        }
        return yield* Deferred.await(invoice)
      }),
      resolve: Effect.fnUntraced(function* (id, payload) {
        const deferred = invoices[id]
        if (!deferred) {
          return yield* new Cause.NoSuchElementError()
        }
        delete invoices[id]
        return yield* Deferred.succeed(deferred, payload)
      }),
    }
  }),
)
