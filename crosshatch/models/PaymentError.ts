import { Schema as S } from "effect"

export class PaymentError extends S.TaggedError<PaymentError>("PaymentError")("PaymentError", {}) {}
