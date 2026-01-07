import { Schema as S } from "effect"

export type InstallationInfo = typeof InstallationInfo["Type"]
export const InstallationInfo = S.Union(
  S.TaggedStruct("Untouched", {
    challengeId: S.UUID,
  }),
  S.TaggedStruct("Linked", {}),
)
