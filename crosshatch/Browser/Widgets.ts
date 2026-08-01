import { Widget, TerminatedError } from "@crosshatch/widget"
import { Schema as S } from "effect"

import { Allowance } from "./Allowance.ts"
import { LinkChallengeId } from "./LinkChallengeId.ts"
import { Prerequisites } from "./Prerequisite.ts"

export const ActivityWidget = Widget.make({
  pathname: "activity",
  payload: S.Void,
  item: S.Void,
  error: S.Never,
})

export const LinkWidget = Widget.make({
  pathname: "link",
  payload: S.Struct({
    challengeId: LinkChallengeId,
    allowance: Allowance,
  }),
  item: S.Void,
  error: TerminatedError,
})

export const PrerequisitesWidget = Widget.make({
  pathname: "prerequisites",
  payload: S.Struct({
    prerequisites: Prerequisites,
  }),
  item: S.Void,
  error: TerminatedError,
})

export const IdWidget = Widget.make({
  pathname: "id",
  payload: S.Void,
  item: S.Void,
  error: TerminatedError,
})
