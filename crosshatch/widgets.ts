import { CrosshatchEnv } from "@crosshatch/util/CrosshatchEnv"
import { embed } from "@crosshatch/widget/embed"
import { Finished } from "@crosshatch/widget/self"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Cause, Effect, pipe, Schema as S, SchemaGetter, Stream } from "effect"
import { UrlParams } from "effect/unstable/http"
import * as Boundary from "liminal-util/Boundary"

import { Allowance } from "./Allowance.ts"
import * as Facade from "./Facade/Facade.ts"
import { LinkChallengeId } from "./LinkChallengeId.ts"

export type Widget<Payload extends S.Codec<any, any>> = {
  Payload: Payload["Type"]
  standard: StandardSchemaV1<{ readonly x: string }, Payload["Type"]>
  host: (
    input: Payload["Type"],
  ) => Effect.Effect<void, Cause.NoSuchElementError | S.SchemaError | UrlParams.UrlParamsError, CrosshatchEnv>
}

const widget = <Payload extends S.Codec<any, any>, Item extends S.Codec<any, any>>({
  pathname,
  payload,
  item,
}: {
  readonly pathname: string
  readonly payload: Payload
  readonly item: Item
}): Widget<Payload> => {
  const Payload = S.StringFromBase64Url.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(payload))))
  const standard = S.toStandardSchemaV1(
    S.Struct({ x: Payload }).pipe(
      S.decodeTo(S.toType(payload), {
        decode: SchemaGetter.transform(({ x }) => x),
        encode: SchemaGetter.transform((x) => ({ x })),
      }),
    ),
  )
  const host = (payload: Payload["Type"]) =>
    pipe(
      payload,
      S.encodeEffect(Payload),
      Effect.flatMap(
        Effect.fn(function* (x) {
          const { url } = yield* CrosshatchEnv
          const { href: src } = yield* UrlParams.makeUrl(
            url("id", pathname),
            UrlParams.make([["x", x]]),
            undefined,
          ).pipe(Effect.fromResult)
          return embed({
            item: S.Union([item, Finished]),
            src,
            className: "crosshatch-widget",
          })
        }),
      ),
      Stream.unwrap,
      Stream.filter(S.is(Finished)),
      Stream.take(1),
      Stream.runDrain,
      Boundary.span("stream-host", import.meta.url, {
        attributes: { pathname },
      }),
    )
  return { Payload, standard, host }
}

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

export const EscalationWidget = widget({
  pathname: "escalation",
  payload: Facade.EscalationError,
  item: S.Never,
})

export const ThawAccountWidget = widget({
  pathname: "thaw-account",
  payload: Facade.AccountFrozenError,
  item: S.Never,
})

export const ThawAppWidget = widget({
  pathname: "thaw-app",
  payload: Facade.AppFrozenError,
  item: S.Never,
})

export const RaiseAllowanceWidget = widget({
  pathname: "raise-allowance",
  payload: Facade.InsufficientAllowanceRemainingError,
  item: S.Never,
})

export const OnrampWidget = widget({
  pathname: "onramp",
  payload: Facade.InsufficientFundsError,
  item: S.Never,
})

export const IdWidget = widget({
  pathname: "id",
  payload: Common,
  item: S.Never,
})
