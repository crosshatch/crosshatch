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
