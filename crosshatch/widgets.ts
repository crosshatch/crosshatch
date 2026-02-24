import { access } from "@crosshatch/util/unwrapping"
import { embed } from "@crosshatch/util/widget/embed"
import { Finished } from "@crosshatch/util/widget/self"
import { UrlParams } from "@effect/platform"
import { Effect, flow, Option, Schema as S, Stream } from "effect"

import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { AccountFrozen, Escalation, InsufficientFunds } from "./DeclinedDecision.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

const widget = <A, I extends UrlParams.Input, A2 = never, I2 = never>({
  pathname,
  payload,
  item = S.Never as never,
}: {
  readonly pathname: string
  readonly payload: S.Schema<A, I>
  readonly item?: S.Schema<A2, I2> | undefined
}) => {
  return {
    payload,
    stream: flow(
      S.encode(payload),
      Effect.flatMap(
        Effect.fn(function* (v) {
          const env = yield* CrosshatchEnv
          return yield* UrlParams.makeUrl(env.href(pathname), UrlParams.fromInput(v), Option.none())
        }),
      ),
      access("href"),
      Effect.map((src) => ({
        item: S.Union(item, Finished),
        src,
      })),
      Effect.map(embed),
      Stream.unwrap,
    ),
  }
}

const Common = S.Struct({
  referrer: S.String.pipe(S.optional),
})

export const EventsWidget = widget({
  pathname: "events",
  payload: Common,
})

export const AllowanceWindow = S.Literal("Day", "Week", "Month", "Year", "Ever")
export const Allowance = S.Struct({
  amount: S.Number,
  window: AllowanceWindow,
})

export const LinkWidget = widget({
  pathname: "link",
  payload: S.Struct({
    id: LinkChallengeId,
  }).pipe(S.extend(Common), S.extend(Allowance)),
})

export const EscalationWidget = widget({
  pathname: "escalation",
  payload: Escalation,
})

export const ThawWidget = widget({
  pathname: "thaw",
  payload: AccountFrozen,
})

export const OnrampExplainerWidget = widget({
  pathname: "onramp-explainer",
  payload: InsufficientFunds,
})

export const IdWidget = widget({
  pathname: "id",
  payload: Common,
})
