import { Schema as S } from "effect"

export const InsufficientFunds = S.TaggedStruct("InsufficientFunds", {})

export const Escalation = S.TaggedStruct("Escalation", {})

export const DeclinedDecision = S.Union(
  InsufficientFunds,
  Escalation,
)
