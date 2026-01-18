import { makeId } from "@crosshatch/util"
import { Schema as S } from "effect"

export const LinkChallengeIdTypeId = Symbol()
export const LinkChallengeId = makeId(LinkChallengeIdTypeId, "LinkChallengeId")

export const LinkChallenge = S.Struct({
  id: LinkChallengeId,
})
