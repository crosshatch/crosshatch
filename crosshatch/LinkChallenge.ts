import { makeId } from "@crosshatch/util/schema"

export const LinkChallengeIdTypeId = Symbol()
export const LinkChallengeId = makeId(LinkChallengeIdTypeId, "LinkChallengeId")
