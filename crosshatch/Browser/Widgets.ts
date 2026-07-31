import {} from "@crosshatch/widget/Widget"
import { Schema as S } from "effect"

import { Allowance } from "./Allowance.ts"
import { LinkChallengeId } from "./LinkChallengeId.ts"
import { PrerequisitesUnmetError } from "./Prerequisite.ts"

const Common = S.Struct({
  referrer: S.String.pipe(S.optional),
})

export const ActivityWidget = widget({
  pathname: "activity",
  payload: Common,
  item: S.Never,
})

export const LinkWidget = widget({
  pathname: "link",
  payload: S.Struct({
    challengeId: LinkChallengeId,
    allowance: Allowance,
    ...Common.fields,
  }),
  item: S.Never,
})

export const PrerequisitesWidget = widget({
  pathname: "prerequisites",
  payload: PrerequisitesUnmetError,
  item: S.Never,
})

export const IdWidget = widget({
  pathname: "id",
  payload: Common,
  item: S.Never,
})
