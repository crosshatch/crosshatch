import { BrowserStream } from "@effect/platform-browser"
import { Effect, Layer, Queue, Schema as S, Stream } from "effect"

import { Launcher, type LauncherConfig, LaunchError } from "./Launcher.ts"
import { ChxWidgetEvent } from "./Self.ts"
import { type Widget, type WidgetPayload, makeUrl } from "./Widget.ts"

export const layer = (config?: LauncherConfig) =>
  Layer.succeed(Launcher, {
    launch: <Payload extends WidgetPayload, A extends S.Top, E extends S.Top>(
      widget: Widget<Payload, A, E>,
      payload: Payload["Type"],
    ) => {
      const { item } = widget
      return Stream.callback<A["Type"], Launcher.Error<E>, Payload["EncodingServices"]>(
        Effect.fnUntraced(function* (queue) {
          let context: WindowProxy | null = null
          yield* BrowserStream.fromEventListenerWindow("message").pipe(
            Stream.runForEach(
              Effect.fn(function* ({ data, source }) {
                if (source !== context) return
                if (S.is(ChxWidgetEvent.cases.Done)(data)) {
                  yield* Queue.end(queue)
                } else if (S.is(item)(data)) {
                  yield* Queue.offer(queue, data)
                }
              }),
            ),
            Effect.forkScoped,
          )
          context = yield* makeUrl({
            baseUrl: config?.url,
            widget,
            payload,
          }).pipe(Effect.map(open))
          if (!context) {
            return yield* new LaunchError({})
          }
          yield* Effect.addFinalizer(() => Effect.sync(() => context.close()))
        }),
      )
    },
  })
