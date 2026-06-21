import { Context, Deferred, Effect, Layer, Schema as S } from "effect"

import { Payload } from "./X402/X402.ts"

export const InvoiceId = S.PropertyKey.pipe(S.brand("Invoice"))

export class InvoiceRegistry extends Context.Service<
  InvoiceRegistry,
  Record<typeof InvoiceId.Type, Deferred.Deferred<typeof Payload.Payload.Type>>
>()("crosshatch/InvoiceRegistry") {}

export const layer = Layer.succeed(InvoiceRegistry, {})

export const invoice = Effect.fn(function* (invoices: (typeof InvoiceRegistry)["Service"]) {
  const deferred = yield* Deferred.make<typeof Payload.Payload.Type>()
  const id = InvoiceId.make(crypto.randomUUID())
  invoices[id] = deferred
  const fiber = yield* Deferred.await(deferred).pipe(Effect.forkChild)
  return [id, fiber] as const
})

export class NoSuchInvoiceError extends S.TaggedErrorClass<NoSuchInvoiceError>()("NoSuchInvoiceError", {
  invoiceId: InvoiceId,
}) {}

export const resolve = Effect.fnUntraced(function* ({
  invoiceId,
  payload,
}: {
  readonly invoiceId: typeof InvoiceId.Type
  readonly payload: typeof Payload.Payload.Type
}) {
  const invoices = yield* InvoiceRegistry
  const deferred = invoices[invoiceId]
  if (!deferred) {
    return yield* new NoSuchInvoiceError({ invoiceId })
  }
  delete invoices[invoiceId]
  yield* Deferred.succeed(deferred, payload)
})
