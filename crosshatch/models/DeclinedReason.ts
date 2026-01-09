import { Schema as S } from "effect"

// TODO: escalation
export const DeclinedReason = S.Union(
  S.TaggedStruct("InsufficientFunds", {}),
)
