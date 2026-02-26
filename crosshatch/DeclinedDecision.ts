import { Schema as S } from "effect"

export const InsufficientFunds = S.TaggedStruct("InsufficientFunds", {})

export const InsufficientAllowanceRemaining = S.TaggedStruct("InsufficientAllowanceRemaining", {})

export const AccountFrozen = S.TaggedStruct("AccountFrozen", {})

export const AppFrozen = S.TaggedStruct("AppFrozen", {})

export const Escalation = S.TaggedStruct("Escalation", {})

export const DeclinedDecision = S.Union(
  InsufficientFunds,
  InsufficientAllowanceRemaining,
  AccountFrozen,
  AppFrozen,
  Escalation,
)
