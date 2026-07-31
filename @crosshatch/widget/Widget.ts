import type { StandardSchemaV1 } from "@standard-schema/spec"
import { Schema as S, Pipeable, Effect, Struct } from "effect"
import { Url, UrlParams } from "effect/unstable/http"

const TypeId = "~@crosshatch/widget/Widget" as const

export type WidgetPayload = S.Constraint & {
  readonly DecodingServices: never
}

export interface WidgetConfig<Payload extends WidgetPayload, Item extends S.Top> {
  readonly baseUrl?: string | undefined
  readonly pathname?: string | undefined
  readonly payload: Payload
  readonly item: Item
}

export interface Widget<Payload extends WidgetPayload, Item extends S.Top>
  extends WidgetConfig<Payload, Item>, Pipeable.Pipeable, StandardSchemaV1<Payload["Encoded"], Payload["Type"]> {
  readonly [TypeId]: typeof TypeId
}

export const make = <Payload extends WidgetPayload, Item extends S.Top>(
  config: WidgetConfig<Payload, Item>,
): Widget<Payload, Item> => {
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

export const makeUrl = <Payload extends WidgetPayload, Item extends S.Top>({
  widget: { baseUrl, pathname, payload: Payload },
  payload,
}: {
  readonly widget: Widget<Payload, Item>
  readonly payload: Payload["Type"]
}) =>
  S.encodeEffect(S.fromURLSearchParams(Payload))(payload).pipe(
    Effect.map(UrlParams.fromInput),
    Effect.flatMap((q) => Url.make(new URL(pathname ?? "./", baseUrl).pathname, q, undefined).pipe(Effect.fromResult)),
    Effect.map(Struct.get("href")),
  )
