import { Schema as S } from "effect"

export const PaymentContextId = S.String.check(S.isUUID()).pipe(S.brand("PaymentContext"))

export const PaymentContextPart = S.TaggedUnion({})

export const PaymentContext = S.Struct({
  id: PaymentContextId,
  title: S.String.pipe(S.NullOr),
  description: S.String,
})
