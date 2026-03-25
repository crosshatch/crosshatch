import { BrowserWorker, BrowserStream } from "@effect/platform-browser"
import { Exit, Deferred, Effect, Schema as S, Layer, Stream } from "effect"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { HostIntroduction, RequestHostIntroduction } from "./facade_handshake.ts"

export const layer = Effect.gen(function* () {
  const ready = yield* Deferred.make<void>()
  yield* BrowserStream.fromEventListenerWindow("message").pipe(
    Stream.takeUntilEffect(
      Effect.fnUntraced(function* ({ data, origin }) {
        const isCrosshatch = yield* CrosshatchEnv.isCrosshatch(origin)
        return isCrosshatch && S.is(HostIntroduction)(data)
      }),
    ),
    Stream.runHead,
    Effect.andThen(Deferred.done(ready, Exit.void)),
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
  yield* Deferred.await(ready)
  const context = yield* Effect.fromNullable(iframe.contentWindow)
  const { port1, port2 } = new MessageChannel()
  context.postMessage(RequestHostIntroduction.make(), "*", [port2])
  return BrowserWorker.layerPlatform(() => port1)
}).pipe(Layer.unwrapEffect)

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
