import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Schema as S, Pipeable, Effect, Struct } from "effect"
import { Url, UrlParams } from "effect/unstable/http"

const TypeId = "~@crosshatch/widget/Widget" as const

export type WidgetPayload = S.Constraint & {
  readonly DecodingServices: never
}

export interface WidgetConfig<Payload extends WidgetPayload, A extends S.Top, E extends S.Top> {
  readonly pathname?: string | undefined
  readonly payload: Payload
  readonly item: A
  readonly error: E
}

export interface Widget<Payload extends WidgetPayload, A extends S.Top, E extends S.Top>
  extends WidgetConfig<Payload, A, E>, Pipeable.Pipeable, StandardSchemaV1<Payload["Encoded"], Payload["Type"]> {
  readonly [TypeId]: typeof TypeId
}

export const make = <Payload extends WidgetPayload, A extends S.Top, E extends S.Top>(
  config: WidgetConfig<Payload, A, E>,
): Widget<Payload, A, E> => {
  const { payload } = config
  return {
    [TypeId]: TypeId,
    ...config,
    "~standard": S.toStandardSchemaV1(payload)["~standard"],
    pipe() {
      return Pipeable.pipeArguments(this, arguments)
    },
  }
}

export const makeUrl = <Payload extends WidgetPayload, A extends S.Top, E extends S.Top>({
  baseUrl,
  widget: { pathname, payload: Payload },
  payload,
}: {
  readonly baseUrl: string | undefined
  readonly widget: Widget<Payload, A, E>
  readonly payload: Payload["Type"]
}) =>
  S.encodeEffect(S.fromURLSearchParams(S.toCodecStringTree(Payload)))(payload).pipe(
    Effect.map(UrlParams.fromInput),
    Effect.flatMap((q) =>
      Url.make(baseUrl ? new URL(pathname ?? "./", baseUrl).href : (pathname ?? "./"), q, undefined).pipe(
        Effect.fromResult,
      ),
    ),

    Effect.map(Struct.get("href")),
  )
