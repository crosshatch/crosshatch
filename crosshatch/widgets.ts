import { access } from "@crosshatch/util/unwrapping"
import { embed } from "@crosshatch/widget/embed"
import { Finished } from "@crosshatch/widget/self"
import { Effect, flow, Schema as S, Stream } from "effect"
import { UrlParams } from "effect/unstable/http"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"
import {
  AccountFrozen,
  AppFrozen,
  Escalation,
  InsufficientAllowanceRemaining,
  InsufficientFunds,
} from "./methods/Propose.ts"

const widget = <A, I extends UrlParams.Input, A2 = never, I2 = never>({
  pathname,
  payload,
  item = S.Never as never,
}: {
  readonly pathname: string
  readonly payload: S.Codec<A, I>
  readonly item?: S.Codec<A2, I2> | undefined
}) => {
  // TODO: refactor
  const stream = flow(
    S.encodeEffect(payload),
    Effect.flatMap(
      Effect.fn(function* (v) {
        return yield* UrlParams.makeUrl(
          yield* CrosshatchEnv.href(pathname),
          UrlParams.fromInput(v),
          undefined,
        ).asEffect()
      }),
    ),
    access("href"),
    Effect.map((src) => ({
      item: S.Union([item, Finished]),
      src,
      className: "crosshatch-widget",
    })),
    Effect.map(embed),
    Stream.unwrap,
  )
  return {
    payload,
    stream,
    runDrain: (payload: A) => stream(payload).pipe(Stream.runDrain),
  }
}

const Common = S.Struct({
  referrer: S.String.pipe(S.optional),
})

export const EventsWidget = widget({
  pathname: "events",
  payload: Common,
})

export const AllowanceWindow = S.Literals(["Day", "Week", "Month", "Year", "Ever"])
export const Allowance = S.Struct({
  amount: S.Number,
  window: AllowanceWindow,
})

export const LinkWidget = widget({
  pathname: "link",
  payload: S.Struct({
    challengeId: LinkChallengeId,
    ...Common.fields,
    ...Allowance.fields,
  }),
})

export const EscalationWidget = widget({
  pathname: "escalation",
  payload: Escalation,
})

export const ThawAccountWidget = widget({
  pathname: "thaw-account",
  payload: AccountFrozen,
})

export const ThawAppWidget = widget({
  pathname: "thaw-app",
  payload: AppFrozen,
})

export const RaiseAllowanceWidget = widget({
  pathname: "raise-allowance",
  payload: InsufficientAllowanceRemaining,
})

export const OnrampExplainerWidget = widget({
  pathname: "onramp-explainer",
  payload: InsufficientFunds,
})

export const IdWidget = widget({
  pathname: "id",
  payload: Common,
})
