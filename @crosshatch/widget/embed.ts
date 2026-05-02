import { BrowserStream } from "@effect/platform-browser"
import { Cause, Effect, Queue, Schema as S, Stream } from "effect"

import type { WidgetConfig } from "./self.ts"

const DEFAULT_SANDBOX = "allow-scripts allow-same-origin allow-popups allow-forms"
let currentZ = 100
const cssText = Object.entries({
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "transparent",
})
  .map(([k, v]) => `${k}: ${v};`)
  .join(" ")

export const embed = <Item extends S.Codec<any, any>>({
  src,
  item,
  className,
}: WidgetConfig<Item> & {
  readonly className?: string | undefined
}) =>
  Stream.callback<Item["Type"], Cause.NoSuchElementError>(
    Effect.fn(function* (queue) {
      yield* BrowserStream.fromEventListenerWindow("message").pipe(
        Stream.runForEach(
          Effect.fn(function* ({ data, source }) {
            const context = yield* Effect.fromNullishOr(iframe.contentWindow)
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
      const { origin } = new URL(src)
      const allow = [
        "payment",
        "clipboard-write",
        "accelerometer",
        "gyroscope",
        `publickey-credentials-create ${origin}`,
        `publickey-credentials-get ${origin}`,
      ].join("; ")
      Object.assign(iframe, {
        sandbox: DEFAULT_SANDBOX,
        allow,
        src: src,
        referrerPolicy: "no-referrer",
        ...(className ? { className } : {}),
      })
      Object.assign(iframe.style, { cssText })
      iframe.style.zIndex = `${currentZ++}`
      document.body.appendChild(iframe)
    }),
  )
