import { Schema as S } from "effect"

export type Link = typeof Link["Type"]
export const Link = S.Union(
  S.TaggedStruct("Untouched", {
    challengeId: S.UUID,
  }),
  S.TaggedStruct("Linked", {}),
)
