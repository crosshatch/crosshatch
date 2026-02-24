import { Cause, Effect, Schema as S, Stream } from "effect"

import type { WidgetConfig } from "./self.ts"

const DEFAULT_SANDBOX = "allow-scripts allow-same-origin allow-popups allow-forms"
const DEFAULT_ALLOW = [
  "payment",
  "clipboard-write",
  "accelerometer",
  "gyroscope",
  "publickey-credentials-create *",
  "publickey-credentials-get *",
].join("; ")
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
  referrerPolicy: "no-referrer",
})
  .map(([k, v]) => `${k}: ${v};`)
  .join(" ")

export const embed = <A, I>({ src, item = S.Never as never }: WidgetConfig<A, I>) =>
  Stream.asyncScoped<A, Cause.NoSuchElementException>(
    Effect.fn(function* (emit) {
      yield* Stream.fromEventListener<MessageEvent>(globalThis, "message").pipe(
        Stream.runForEach(
          Effect.fn(function* ({ data, source }) {
            const context = yield* Effect.fromNullable(iframe.contentWindow)
            if (source === context && S.is(item)(data)) {
              emit.single(data)
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
      console.log("INITIALIZING")
      Object.assign(iframe, {
        sandbox: DEFAULT_SANDBOX,
        allow: DEFAULT_ALLOW,
        src: src,
        referrerPolicy: "no-referrer",
      })
      Object.assign(iframe.style, { cssText })
      iframe.style.zIndex = `${currentZ++}`
      document.body.appendChild(iframe)
    }),
  )
