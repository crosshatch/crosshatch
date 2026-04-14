import { Schema as S } from "effect"
import { Method } from "liminal"

import { Payload } from "../X402/Payload.ts"
import { Required } from "../X402/Required.ts"

export const Propose = Method.define({
  payload: {
    required: Required,
  },
  success: S.Struct({
    payload: Payload,
  }),
  failure: S.suspend(() => DeclinedDecision),
})

export class AllowanceDenial extends S.TaggedErrorClass<AllowanceDenial>()("AllowanceDenial", {}) {}

export class InsufficientFunds extends S.TaggedErrorClass<InsufficientFunds>()("InsufficientFunds", {}) {}

export class InsufficientAllowanceRemaining extends S.TaggedErrorClass<InsufficientAllowanceRemaining>()(
  "InsufficientAllowanceRemaining",
  {},
) {}

export class AccountFrozen extends S.TaggedErrorClass<AccountFrozen>()("AccountFrozen", {}) {}

export class AppFrozen extends S.TaggedErrorClass<AppFrozen>()("AppFrozen", {}) {}

export class Escalation extends S.TaggedErrorClass<Escalation>()("Escalation", {}) {}

export const DeclinedDecision = S.Union([
  AllowanceDenial,
  InsufficientFunds,
  InsufficientAllowanceRemaining,
  AccountFrozen,
  AppFrozen,
  Escalation,
])
