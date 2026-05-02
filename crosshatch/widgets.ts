import { embed } from "@crosshatch/widget/embed"
import { Finished } from "@crosshatch/widget/self"
import { Effect, flow, Schema as S, SchemaGetter, Stream } from "effect"
import { UrlParams } from "effect/unstable/http"

import { Allowance } from "./Allowance.ts"
import * as Facade from "./Facade/Facade.ts"
import { InternalEnv } from "./InternalEnv.ts"
import { LinkChallengeId } from "./LinkChallengeId.ts"

const widget = <Payload extends S.Codec<any, any>, Item extends S.Codec<any, any>>({
  pathname,
  payload,
  item,
}: {
  readonly pathname: string
  readonly payload: Payload
  readonly item: Item
}) => {
  const Payload = S.StringFromBase64Url.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(payload))))
  const standard = S.toStandardSchemaV1(
    S.Struct({ x: Payload }).pipe(
      S.decodeTo(S.toType(payload), {
        decode: SchemaGetter.transform(({ x }) => x),
        encode: SchemaGetter.transform((x) => ({ x })),
      }),
    ),
  )
  const host = flow(
    S.encodeEffect(Payload),
    Effect.flatMap(
      Effect.fn(function* (x) {
        const base = yield* InternalEnv.href(pathname)
        const { href: src } = yield* UrlParams.makeUrl(base, UrlParams.make([["x", x]]), undefined)
        return embed({
          item: S.Union([item, Finished]),
          src,
          className: "crosshatch-widget",
        })
      }),
    ),
    Stream.unwrap,
    Stream.takeUntil(S.is(Finished)),
    Stream.runDrain,
  )
  return {
    standard,
    host,
  } as {
    Payload: Payload["Type"]
    standard: typeof standard
    host: typeof host
  }
}

const Common = S.Struct({
  referrer: S.String.pipe(S.optional),
})

export const EventsWidget = widget({
  pathname: "events",
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

export const EscalationWidget = widget({
  pathname: "escalation",
  payload: Facade.Escalation,
  item: S.Never,
})

export const ThawAccountWidget = widget({
  pathname: "thaw-account",
  payload: Facade.AccountFrozen,
  item: S.Never,
})

export const ThawAppWidget = widget({
  pathname: "thaw-app",
  payload: Facade.AppFrozen,
  item: S.Never,
})

export const RaiseAllowanceWidget = widget({
  pathname: "raise-allowance",
  payload: Facade.InsufficientAllowanceRemaining,
  item: S.Never,
})

export const OnrampExplainerWidget = widget({
  pathname: "onramp",
  payload: Facade.InsufficientFunds,
  item: S.Never,
})

export const IdWidget = widget({
  pathname: "id",
  payload: Common,
  item: S.Never,
})
