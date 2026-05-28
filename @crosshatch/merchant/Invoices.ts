import { Payload } from "@crosshatch/x402"
import { InvoiceId } from "crosshatch"
import { Context, Deferred, Effect, Layer, Schema as S } from "effect"

export class Invoices extends Context.Service<Invoices>()("@crosshatch/merchant/Invoices", {
  make: Effect.sync<Record<typeof InvoiceId.Type, Deferred.Deferred<typeof Payload.Payload.Type>>>(() => ({})),
}) {
  static readonly layer = Layer.succeed(this, {})
}

export const invoice = Effect.fn(function* (invoices: (typeof Invoices)["Service"]) {
  const deferred = yield* Deferred.make<typeof Payload.Payload.Type>()
  const id = InvoiceId.make(crypto.randomUUID())
  invoices[id] = deferred
  const fiber = yield* Deferred.await(deferred).pipe(Effect.forkChild)
  return [id, fiber] as const
})

export class NoSuchInvoiceError extends S.TaggedErrorClass<NoSuchInvoiceError>()("NoSuchInvoiceError", {
  invoiceId: InvoiceId,
}) {}

export const resolveInvoice = Effect.fnUntraced(function* ({
  invoiceId,
  payload,
}: {
  readonly invoiceId: typeof InvoiceId.Type
  readonly payload: typeof Payload.Payload.Type
}) {
  const invoices = yield* Invoices
  const deferred = invoices[invoiceId]
  if (!deferred) {
    return yield* new NoSuchInvoiceError({ invoiceId })
  }
  delete invoices[invoiceId]
  yield* Deferred.succeed(deferred, payload)
})
