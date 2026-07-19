import { Cause, Context, Data, Deferred, Effect, Layer } from "effect"

import * as Payload from "../Payload.ts"
import type { Requirements } from "../Requirements.ts"
import type { PaymentId } from "./PaymentId.ts"

export class PayloadUnacceptableError extends Data.TaggedError("PayloadUnacceptableError")<{
  readonly accepts: ReadonlyArray<Requirements>
}> {}

export class Invoices extends Context.Service<
  Invoices,
  {
    readonly add: (accepts: ReadonlyArray<Requirements>, id: typeof PaymentId.Type) => Effect.Effect<void>

    readonly await: (id: typeof PaymentId.Type) => Effect.Effect<Payload.Payload, Cause.NoSuchElementError>

    readonly resolve: (
      id: typeof PaymentId.Type,
      payload: Payload.Payload,
    ) => Effect.Effect<void, Cause.NoSuchElementError | PayloadUnacceptableError>
  }
>()("crosshatch/ChxRpc/Invoices") {}

export const layerMemory = Layer.effect(
  Invoices,
  Effect.sync(() => {
    const invoices: Record<
      typeof PaymentId.Type,
      {
        readonly accepts: ReadonlyArray<Requirements>
        readonly deferred: Deferred.Deferred<Payload.Payload>
      }
    > = {}
    return {
      add: Effect.fnUntraced(function* (accepts, id) {
        const deferred = yield* Deferred.make<Payload.Payload>()
        invoices[id] = { accepts, deferred }
      }),
      await: Effect.fnUntraced(function* (paymentId) {
        const { deferred } = yield* Effect.fromNullishOr(invoices[paymentId])
        return yield* Deferred.await(deferred)
      }),
      resolve: Effect.fnUntraced(function* (id, payload) {
        const { deferred, accepts } = yield* Effect.fromNullishOr(invoices[id])
        if (!Payload.isAcceptable(accepts, payload)) {
          delete invoices[id]
          return yield* new PayloadUnacceptableError({ accepts })
        }
        return yield* Deferred.succeed(deferred, payload)
      }),
    }
  }),
)
