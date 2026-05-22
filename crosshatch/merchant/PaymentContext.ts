import { Schema as S, Context } from "effect"

export const PaymentMetadata = S.Struct({
  title: S.String,
  description: S.String,
})

export const PaymentContext = S.Struct({
  id: S.String.check(S.isUUID()),
  metadata: PaymentMetadata.pipe(S.optional),
})

export class CurrentPaymentContext extends Context.Service<
  CurrentPaymentContext,
  typeof PaymentContext.Type | undefined
>()("crosshatch/CurrentPaymentContext") {}
