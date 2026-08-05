import { BrowserStream } from "@effect/platform-browser"
import { Effect, Queue, Record, Schema as S, Stream, Layer } from "effect"

import { Launcher, LaunchError, type LauncherConfig } from "./Launcher.ts"
import { ChxWidgetEvent } from "./Self.ts"
import * as Widget from "./Widget.ts"

export interface EmbedLauncherConfig extends LauncherConfig {
  readonly className?: string | undefined
}

export const layer = (config?: EmbedLauncherConfig) =>
  Layer.effect(
    Launcher,
    Effect.gen(function* () {
      const { className, url } = config ?? {}
      return {
        launch: <Payload extends Widget.WidgetPayload, A extends S.Top, E extends S.Top>(
          widget: Widget.Widget<Payload, A, E>,
          payload: Payload["Type"],
        ) => {
          const { item } = widget
          return Stream.callback<A["Type"], Launcher.Error<E>, Payload["EncodingServices"]>(
            Effect.fnUntraced(function* (queue) {
              yield* BrowserStream.fromEventListenerWindow("message").pipe(
                Stream.runForEach(
                  Effect.fn(function* ({ data, source }) {
                    const context = yield* Effect.fromNullishOr(iframe.contentWindow).pipe(
                      Effect.mapError((cause) => new LaunchError({ cause })),
                    )
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
              const iframe = document.createElement("iframe")
              yield* Effect.addFinalizer(() => Effect.sync(() => iframe.remove()))
              const { origin } = url ? new URL(url) : globalThis
              const allow = [
                "payment",
                "clipboard-write",
                "accelerometer",
                "gyroscope",
                `publickey-credentials-create ${origin}`,
                `publickey-credentials-get ${origin}`,
              ].join("; ")
              Object.assign(iframe, {
                sandbox: "allow-scripts allow-same-origin allow-popups allow-forms",
                allow,
                src: yield* Widget.makeUrl({
                  baseUrl: url,
                  widget,
                  payload,
                }),
                referrerPolicy: "no-referrer",
                ...(className && { className }),
              })
              iframe.style.cssText = Record.collect(
                {
                  position: "fixed",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "transparent",
                },
                ([k, v]) => `${k}: ${v};`,
              ).join(" ")
              document.body.appendChild(iframe)
            }),
          )
        },
      }
    }),
  )
