import { embed } from "@crosshatch/widget/embed"
import { Finished } from "@crosshatch/widget/self"
import { Effect, flow, Schema as S, Stream } from "effect"
import { UrlParams } from "effect/unstable/http"

import { Allowance } from "./Allowance.ts"
import * as Facade from "./Facade/Facade.ts"
import { InternalEnv } from "./InternalEnv.ts"
import { LinkChallengeId } from "./LinkChallengeId.ts"

const widget = <A, I extends UrlParams.Input, A2 = never, I2 = never>({
  pathname,
  payload,
  item = S.Never as never,
}: {
  readonly pathname: string
  readonly payload: S.Codec<A, I>
  readonly item?: S.Codec<A2, I2> | undefined
}) => {
  const stream = flow(
    S.encodeEffect(payload),
    Effect.flatMap(
      Effect.fn(function* (v) {
        const base = yield* InternalEnv.href(pathname)
        const { href: src } = yield* UrlParams.makeUrl(base, UrlParams.fromInput(v), undefined)
        return embed({
          item: S.Union([item, Finished]),
          src,
          className: "crosshatch-widget",
        })
      }),
    ),
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
  payload: Facade.Escalation,
})

export const ThawAccountWidget = widget({
  pathname: "thaw-account",
  payload: Facade.AccountFrozen,
})

export const ThawAppWidget = widget({
  pathname: "thaw-app",
  payload: Facade.AppFrozen,
})

export const RaiseAllowanceWidget = widget({
  pathname: "raise-allowance",
  payload: Facade.InsufficientAllowanceRemaining,
})

export const OnrampExplainerWidget = widget({
  pathname: "onramp",
  payload: Facade.InsufficientFunds,
})

export const IdWidget = widget({
  pathname: "id",
  payload: Common,
})
