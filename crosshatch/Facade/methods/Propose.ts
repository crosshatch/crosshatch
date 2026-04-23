import { Payload, Required } from "@crosshatch/x402"
import { Schema as S } from "effect"
import { Method } from "liminal"

export const Propose = Method.make({
  payload: S.Struct({
    required: Required.Required,
  }),
  success: S.Struct({
    payload: Payload.Payload,
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
