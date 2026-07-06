import { Data, Effect, Schema as S, UndefinedOr } from "effect"

import * as Extension from "./Extension.ts"

export const PaymentId = S.String.check(S.isLengthBetween(16, 128), S.isPattern(/^[a-zA-Z0-9_-]+$/)).pipe(
  S.brand("crosshatch/PaymentId"),
)

export class PaymentIdExtension extends Extension.Service<PaymentIdExtension>()("crosshatch/PaymentId", {
  name: "payment-identifier",
  payload: S.Struct({
    required: S.Boolean,
    id: PaymentId.pipe(S.optional),
  }),
  success: S.Struct({
    required: S.Boolean,
    id: PaymentId.pipe(S.optional),
  }),
}) {}

export class PaymentIdMissingError extends Data.TaggedError("PaymentIdMissingError")<{}> {}

export const ensure = Effect.gen(function* () {
  const extension = yield* PaymentIdExtension
  return yield* UndefinedOr.match(extension?.id, {
    onDefined: Effect.succeed,
    onUndefined: () => new PaymentIdMissingError(),
  })
})
