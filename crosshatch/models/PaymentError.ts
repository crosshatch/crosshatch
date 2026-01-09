import { Schema as S } from "effect"
import { DeclinedReason } from "./DeclinedReason.ts"

export class DeclinedError extends S.TaggedError<DeclinedError>("DeclinedError")("DeclinedError", {
  reason: DeclinedReason,
}) {}

export class PrivateKeyNotSupportedError
  extends S.TaggedError<PrivateKeyNotSupportedError>("PrivateKeyNotSupportedError")("PrivateKeyNotSupportedError", {})
{}

export const PaymentError = S.Union(
  DeclinedError,
  PrivateKeyNotSupportedError,
)
