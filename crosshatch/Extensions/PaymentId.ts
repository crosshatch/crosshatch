import { Schema as S } from "effect"

import * as Extension from "../Extension.ts"

export const PaymentId = S.String.check(S.isLengthBetween(16, 128), S.isPattern(/^[a-zA-Z0-9_-]+$/u)).pipe(
  S.brand("crosshatch/PaymentId"),
)

export class FromMerchant extends Extension.Service<FromMerchant>()("crosshatch/FromMerchant", {
  identifier: "payment-identifier",
  info: S.Struct({
    required: S.tag(true),
    id: PaymentId,
  }),
  echo: S.Struct({
    required: S.tag(true),
    id: PaymentId,
  }),
}) {}

export class FromClient extends Extension.Service<FromClient>()("crosshatch/FromClient", {
  identifier: "payment-identifier",
  info: S.Struct({
    required: S.tag(true),
  }),
  echo: S.Struct({
    required: S.tag(true),
    id: PaymentId.pipe(S.optional),
  }),
}) {}

export class FromEither extends Extension.Service<FromEither>()("crosshatch/FromEither", {
  identifier: "payment-identifier",
  info: S.Struct({
    required: S.tag(true),
    id: PaymentId.pipe(S.optional),
  }),
  echo: S.Struct({
    required: S.tag(true),
    id: PaymentId,
  }),
}) {}
