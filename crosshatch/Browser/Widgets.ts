import { Widget } from "@crosshatch/widget"
import { Schema as S } from "effect"

import { Allowance } from "./Allowance.ts"
import { LinkChallengeId } from "./LinkChallengeId.ts"
import { Prerequisites } from "./Prerequisite.ts"

const commonFields = {
  referrer: S.String.pipe(S.NullOr),
}

export const activity = Widget.make({
  pathname: "activity",
  payload: S.Struct(commonFields),
  item: S.Never,
})

export const link = Widget.make({
  pathname: "link",
  payload: S.Struct({
    challengeId: LinkChallengeId,
    allowance: Allowance,
    ...commonFields,
  }),
  item: S.Never,
})

export const prerequisites = Widget.make({
  pathname: "prerequisites",
  payload: S.Struct({
    prerequisites: Prerequisites,
  }),
  item: S.Never,
})

export const id = Widget.make({
  pathname: "id",
  payload: S.Struct(commonFields),
  item: S.Never,
})
