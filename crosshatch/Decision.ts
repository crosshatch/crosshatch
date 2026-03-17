import { Schema as S } from "effect"

import { Payload } from "./X402/Payload.ts"

export class Approved extends S.TaggedClass<Approved>()("Approved", {
  payload: Payload,
}) {}

export class InsufficientFunds extends S.TaggedClass<InsufficientFunds>()("InsufficientFunds", {}) {}

export class InsufficientAllowanceRemaining extends S.TaggedClass<InsufficientAllowanceRemaining>()(
  "InsufficientAllowanceRemaining",
  {},
) {}

export class AccountFrozen extends S.TaggedClass<AccountFrozen>()("AccountFrozen", {}) {}

export class AppFrozen extends S.TaggedClass<AppFrozen>()("AppFrozen", {}) {}

export class Escalation extends S.TaggedClass<Escalation>()("Escalation", {}) {}

export const DeclinedDecision = S.Union(
  InsufficientFunds,
  InsufficientAllowanceRemaining,
  AccountFrozen,
  AppFrozen,
  Escalation,
)

export const Decision = S.Union(Approved, DeclinedDecision)
