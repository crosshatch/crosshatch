import { Context, Data, Stream, type Schema as S, Effect, Function } from "effect"
import type { Url } from "effect/unstable/http"

import type { Widget, WidgetPayload } from "./Widget.ts"

export interface LauncherConfig {
  readonly url?: string | undefined
}

export class LaunchError extends Data.TaggedError("WidgetError")<{
  readonly cause?: unknown
}> {}

export class Launcher extends Context.Service<
  Launcher,
  {
    readonly launch: <Payload extends WidgetPayload, A extends S.Top, E extends S.Top>(
      widget: Widget<Payload, A, E>,
      payload: Payload["Type"],
    ) => Stream.Stream<A["Type"], Launcher.Error<E>, Payload["EncodingServices"]>
  }
>()("@crosshatch/widget/Launcher") {}

export declare namespace Launcher {
  export type Error<E extends S.Top> = LaunchError | Url.UrlError | S.SchemaError | E["Type"]
}

export const launch = Function.dual<
  <Payload extends WidgetPayload>(
    payload: Payload["Type"],
  ) => <A extends S.Top, E extends S.Top>(
    widget: Widget<Payload, A, E>,
  ) => Stream.Stream<A["Type"], Launcher.Error<E>, Payload["EncodingServices"]>,
  <Payload extends WidgetPayload, A extends S.Top, E extends S.Top>(
    widget: Widget<Payload, A, E>,
    payload: Payload["Type"],
  ) => Stream.Stream<A["Type"], Launcher.Error<E>, Payload["EncodingServices"]>
>(
  2,
  <Payload extends WidgetPayload, A extends S.Top, E extends S.Top>(
    widget: Widget<Payload, A, E>,
    payload: Payload["Type"],
  ) =>
    Launcher.pipe(
      Effect.map(({ launch }) => launch(widget, payload)),
      Stream.unwrap,
    ),
)
