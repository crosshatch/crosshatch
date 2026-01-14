import { Schema as S } from "effect"

export const DeclinedDecision = S.Union(
  S.TaggedStruct("InsufficientFunds", {}),
  S.TaggedStruct("Escalate", {}),
)
