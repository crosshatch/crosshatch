import { Schema as S } from "effect"

import { LinkChallengeId } from "./LinkChallenge.ts"

export const Status = S.Union(
  S.TaggedStruct("Anonymous", {
    challengeId: LinkChallengeId,
  }),
  S.TaggedStruct("Linked", {}),
)
