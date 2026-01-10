import { Schema as S } from "effect"

// TODO: escalation
export type DeclinedReason = typeof DeclinedReason["Type"]
export const DeclinedReason = S.Union(
  S.TaggedStruct("InsufficientFunds", {}),
  S.TaggedStruct("Todo", {}),
)
