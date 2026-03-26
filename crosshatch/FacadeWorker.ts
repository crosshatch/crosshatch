import { BrowserWorker, BrowserStream } from "@effect/platform-browser"
import { Effect, Fiber, Layer, Stream } from "effect"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { HostIntroduction } from "./facade_handshake.ts"

export const layer = Effect.gen(function* () {
  const fiber = yield* BrowserStream.fromEventListenerWindow("message").pipe(
    Stream.takeUntilEffect(
      Effect.fnUntraced(function* ({ data, origin }) {
        const isCrosshatch = yield* CrosshatchEnv.isCrosshatch(origin)
        return isCrosshatch && data?._tag === "RequestHostIntroduction"
      }),
    ),
    Stream.runDrain,
    Effect.forkScoped,
  )
  const iframe = document.createElement("iframe")
  Object.assign(iframe, {
    id: "crosshatch-enclave",
    height: 1,
    sandbox: "allow-scripts allow-same-origin",
    src: yield* CrosshatchEnv.href("enclave"),
    width: 1,
  })
  Object.assign(iframe.style, { cssText })
  document.body.appendChild(iframe)
  yield* Fiber.join(fiber)
  const context = yield* Effect.fromNullable(iframe.contentWindow)
  const { port1, port2 } = new MessageChannel()
  context.postMessage(HostIntroduction.make(), "*", [port2])
  return BrowserWorker.layerPlatform(() => port1)
}).pipe(Layer.unwrapScoped)

const cssText = Object.entries({
  border: 0,
  bottom: "-1px",
  clipPath: "inset(50%)",
  left: "-1px",
  opacity: 0,
  overflow: "hidden",
  padding: 0,
  pointerEvents: "none",
  position: "absolute",
})
  .map(([k, v]) => `${k}: ${v};`)
  .join(" ")
