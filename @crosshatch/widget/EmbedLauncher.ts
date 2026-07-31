import { BrowserStream } from "@effect/platform-browser"
import { Effect, Queue, Record, Schema as S, Stream, Layer } from "effect"

import { Launcher, LaunchError } from "./Launcher.ts"
import { type Widget, type WidgetPayload, makeUrl } from "./Widget.ts"

export interface EmbedLauncherConfig {
  readonly className?: string | undefined
}

export const layer = (config?: EmbedLauncherConfig) =>
  Layer.effect(
    Launcher,
    Effect.gen(function* () {
      const { className } = config ?? {}
      return {
        launch:
          <Payload extends WidgetPayload>(payload: Payload["Type"]) =>
          <Item extends S.Top>(widget: Widget<Payload, Item>) => {
            const { baseUrl, item } = widget
            return Stream.callback(
              Effect.fn(function* (queue) {
                yield* BrowserStream.fromEventListenerWindow("message").pipe(
                  Stream.runForEach(
                    Effect.fn(function* ({ data, source }) {
                      const context = yield* Effect.fromNullishOr(iframe.contentWindow).pipe(
                        Effect.mapError((cause) => new LaunchError({ cause })),
                      )
                      if (source === context && S.is(item)(data)) {
                        yield* Queue.offer(queue, data)
                      }
                    }),
                  ),
                  Effect.forkScoped,
                )
                const iframe = document.createElement("iframe")
                yield* Effect.addFinalizer(() =>
                  Effect.sync(() => {
                    document.body.removeChild(iframe)
                  }),
                )
                const origin = baseUrl ? new URL(baseUrl).origin : globalThis.origin
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
                  src: yield* makeUrl({ widget, payload }),
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
