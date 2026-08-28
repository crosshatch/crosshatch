import { Schema as S } from "effect"

import * as Extension from "../Extension.ts"

export type PaymentId = typeof PaymentId.Type
export const PaymentId = S.String.check(S.isLengthBetween(16, 128), S.isPattern(/^[a-zA-Z0-9_-]+$/u)).pipe(
  S.brand("crosshatch/PaymentId"),
)

export const random = () => PaymentId.make(crypto.randomUUID(), { disableChecks: true })

const identifier = "payment-identifier" as const

const schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  properties: {
    required: {
      type: "boolean",
    },
    id: {
      type: "string",
      minLength: 16,
      maxLength: 128,
      pattern: "^[a-zA-Z0-9_-]+$",
    },
  },
  required: ["required"],
}

export class FromMerchant extends Extension.Service<FromMerchant>()("crosshatch/FromMerchant", {
  identifier,
  schema,
  info: S.Struct({
    required: S.tag(true),
    id: PaymentId,
  }),
  enrichment: S.Struct({
    required: S.tag(true),
    id: PaymentId,
  }),
}) {}

export class FromClient extends Extension.Service<FromClient>()("crosshatch/FromClient", {
  identifier,
  schema,
  info: S.Struct({
    required: S.tag(true),
  }),
  enrichment: S.Struct({
    required: S.tag(true),
    id: PaymentId,
  }),
}) {}

export class FromEither extends Extension.Service<FromEither>()("crosshatch/FromEither", {
  identifier,
  schema,
  info: S.Struct({
    required: S.tag(true),
    id: PaymentId.pipe(S.optional),
  }),
  enrichment: S.Struct({
    required: S.tag(true),
    id: PaymentId,
  }),
}) {}
