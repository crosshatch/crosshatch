import { access } from "@crosshatch/util/unwrapping"
import * as Widget from "@crosshatch/util/Widget"
import { UrlParams } from "@effect/platform"
import { Effect, flow, Option, Schema as S, Stream } from "effect"
import { AccountFrozen, Escalation, InsufficientFunds } from "./DeclinedDecision.ts"
import { appUrl } from "./env.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

const widget = <A, I extends UrlParams.Input, A2, I2>({ pathname, payload, event }: {
  readonly pathname: string
  readonly payload: S.Schema<A, I>
  readonly event: S.Schema<A2, I2>
}) => {
  return {
    payload,
    stream: flow(
      S.encode(payload),
      Effect.flatMap((v) =>
        UrlParams.makeUrl(
          new URL(pathname, appUrl).href,
          UrlParams.fromInput(v),
          Option.none(),
        )
      ),
      access("href"),
      Effect.map((src) => ({
        src,
        event,
      } satisfies Widget.WidgetConfig<A2, I2>)),
      Effect.map(Widget.embed),
      Stream.unwrap,
    ),
  }
}

const Common = S.Struct({
  referrer: S.String.pipe(S.optional),
})

export const EventsWidget = widget({
  pathname: "/events",
  payload: Common,
  event: S.Void,
})

export const AllowanceWindow = S.Literal("Day", "Week", "Month", "Year", "Ever")
export const Allowance = S.Struct({
  window: AllowanceWindow,
  amount: S.Number,
})

export const LinkWidget = widget({
  pathname: "/link",
  payload: S.Struct({
    id: LinkChallengeId,
  }).pipe(
    S.extend(Common),
    S.extend(Allowance),
  ),
  event: S.Void,
})

export const EscalationWidget = widget({
  pathname: "/escalation",
  payload: Escalation,
  event: S.Void,
})

export const ThawWidget = widget({
  pathname: "/thaw",
  payload: AccountFrozen,
  event: S.Void,
})

export const OnrampExplainerWidget = widget({
  pathname: "/onramp-explainer",
  payload: InsufficientFunds,
  event: S.Void,
})

export const IdWidget = widget({
  pathname: "/id",
  payload: Common,
  event: S.Void,
})
