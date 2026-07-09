import { Schema as S, Cause, Context, Deferred, Effect, Layer } from "effect"

import { Extension, Payload, Required } from "../index.ts"

export const PaymentId = S.String.check(S.isLengthBetween(16, 128), S.isPattern(/^[a-zA-Z0-9_-]+$/)).pipe(
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

  static readonly decodeRequired = (required: typeof Required.Required.Type) =>
    Effect.gen({ self: this }, function* () {
      const { identifier, info } = this
      return yield* S.decodeUnknownEffect(S.toCodecJson(info))(required.extensions?.[identifier])
    })

  static readonly decodePayload = (required: typeof Payload.Payload.Type) =>
    Effect.gen({ self: this }, function* () {
      const { identifier, echo } = this
      return yield* S.decodeUnknownEffect(S.toCodecJson(echo))(required.extensions?.[identifier])
    })
}

export class Payments extends Context.Service<
  Payments,
  {
    readonly make: Effect.Effect<typeof PaymentId.Type>

    readonly await: (
      paymentId: typeof PaymentId.Type,
    ) => Effect.Effect<typeof Payload.Payload.Type, Cause.NoSuchElementError>

    readonly resolve: (config: {
      readonly paymentId: typeof PaymentId.Type
      readonly payload: typeof Payload.Payload.Type
    }) => Effect.Effect<void, Cause.NoSuchElementError>
  }
>()("crosshatch/Payments") {}

export const layer = Layer.effect(
  Payments,
  Effect.sync(() => {
    const invoices: Record<typeof PaymentId.Type, Deferred.Deferred<typeof Payload.Payload.Type>> = {}
    return {
      make: Effect.gen(function* () {
        const deferred = yield* Deferred.make<typeof Payload.Payload.Type>()
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
