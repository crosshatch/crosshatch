import { embed } from "@crosshatch/widget/embed"
import { Finished } from "@crosshatch/widget/self"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Data, Effect, pipe, Schema as S, SchemaGetter, Stream } from "effect"
import { UrlParams } from "effect/unstable/http"
import * as Boundary from "liminal-util/Boundary"

import { Stage } from "../Stage.ts"
import { Allowance } from "./Allowance.ts"
import { LinkChallengeId } from "./LinkChallengeId.ts"
import { PrerequisitesUnmetError } from "./Prerequisite.ts"

export type Widget<Payload extends S.Codec<any, any>> = {
  Payload: Payload["Type"]
  standard: StandardSchemaV1<{ readonly x: string }, Payload["Type"]>
  host: (input: Payload["Type"]) => Effect.Effect<void, WidgetError>
}

export class WidgetError extends Data.TaggedError("WidgetError")<{
  readonly cause: unknown
}> {}

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
        decode: SchemaGetter.transform((input) => (input as { readonly x: Payload["Type"] }).x), // TODO
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
          const { url } = yield* Stage
          const { href: src } = yield* UrlParams.makeUrl(
            url("link", pathname),
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
      Effect.mapError((cause) => new WidgetError({ cause })),
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

export const PrerequisitesWidget = widget({
  pathname: "prerequisites",
  payload: PrerequisitesUnmetError,
  item: S.Never,
})

export const IdWidget = widget({
  pathname: "id",
  payload: Common,
  item: S.Never,
})
