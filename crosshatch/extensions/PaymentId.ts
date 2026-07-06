import { Effect, Schema as S } from "effect"

import * as Extension from "../Extension.ts"

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
}
