import { Schema as S, Context } from "effect"

export const PaymentContextId = S.String.check(S.isUUID()).pipe(S.brand("Group"))

export const PaymentMetadata = S.Struct({
  description: S.String,
  paymentContextId: PaymentContextId,
})
export class CurrentPaymentMetadata extends Context.Service<CurrentPaymentMetadata, typeof PaymentMetadata.Type>()(
  "crosshatch/CurrentPaymentMetadata",
) {}
