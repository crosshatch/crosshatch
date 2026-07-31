import { Context, Data, type Stream, type Schema as S } from "effect"
import type { Url } from "effect/unstable/http"

import type { Widget, WidgetPayload } from "./Widget.ts"

export class LaunchError extends Data.TaggedError("WidgetError")<{
  readonly cause?: unknown
}> {}

export class Launcher extends Context.Service<
  Launcher,
  {
    readonly launch: <Payload extends WidgetPayload>(
      payload: Payload["Type"],
    ) => <Item extends S.Top>(
      widget: Widget<Payload, Item>,
    ) => Stream.Stream<Item["Type"], Url.UrlError | S.SchemaError, Payload["EncodingServices"]>
  }
>()("@crosshatch/widget/Launcher") {}
