import { Schema as S } from "effect"

export const PaymentError = S.Union(
  S.TaggedStruct("PaymentError", {}),
)
