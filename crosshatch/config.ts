import { toHref } from "@crosshatch/util"
import { Effect, flow, Schema as S } from "effect"
import { appUrl } from "./env.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

export const Presentation = S.Literal("Redirect", "Embedded", "Popup")

const Common = S.Struct({
  presentation: Presentation.pipe(S.optional),
  referrer: S.String.pipe(S.optional),
})

export const HomeConfig = Common
export const homeHref = flow(
  S.encode(HomeConfig),
  Effect.map(toHref(new URL(appUrl))),
)

export const AllowanceWindow = S.Literal("Day", "Week", "Month", "Year", "Ever")
export const Allowance = S.Struct({
  window: AllowanceWindow,
  amount: S.Number,
})

export const LinkConfig = S.Struct({
  id: LinkChallengeId,
}).pipe(
  S.extend(Common),
  S.extend(Allowance),
)
export const linkHref = flow(
  S.encode(LinkConfig),
  Effect.map(toHref(new URL("/link", appUrl))),
)
