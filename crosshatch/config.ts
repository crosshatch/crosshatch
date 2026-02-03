import { toHref } from "@crosshatch/util"
import { Effect, flow, Schema as S } from "effect"
import { AccountFrozen, Escalation, InsufficientFunds } from "./DeclinedDecision.ts"
import { appUrl } from "./env.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

const Common = S.Struct({
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

export const escalationHref = flow(
  S.encode(Escalation),
  Effect.map(toHref(new URL("/escalation", appUrl))),
)

export const thawHref = flow(
  S.encode(AccountFrozen),
  Effect.map(toHref(new URL("/thaw", appUrl))),
)

export const onrampExplainerHref = flow(
  S.encode(InsufficientFunds),
  Effect.map(toHref(new URL("/onramp-explainer", appUrl))),
)
