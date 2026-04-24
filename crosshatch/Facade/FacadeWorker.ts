import * as Host from "@crosshatch/widget/Host"
import { BrowserWorker, BrowserStream } from "@effect/platform-browser"
import { Effect, Fiber, Layer, Stream, Schema as S } from "effect"

import { InternalEnv } from "../InternalEnv.ts"
import { FacadeIntroduction, RequestFacadeIntroduction } from "./handshake.ts"

export const layer = Effect.gen(function* () {
  yield* Host.hostListener.pipe(Effect.forkScoped)
  const fiber = yield* BrowserStream.fromEventListenerWindow("message").pipe(
    Stream.takeUntil(({ data, origin }) => InternalEnv.isCrosshatch(origin) && S.is(RequestFacadeIntroduction)(data)),
    Stream.runDrain,
    Effect.forkScoped,
  )
  const iframe = document.createElement("iframe")
  Object.assign(iframe, {
    id: "crosshatch-enclave",
    height: 1,
    sandbox: "allow-scripts allow-same-origin",
    src: yield* InternalEnv.href("enclave"),
    width: 1,
  })
  Object.assign(iframe.style, { cssText })
  document.body.appendChild(iframe)
  yield* Effect.addFinalizer(() => Effect.sync(() => document.body.removeChild(iframe)))
  yield* Fiber.join(fiber)
  const context = yield* Effect.fromNullishOr(iframe.contentWindow)
  const { port1, port2 } = new MessageChannel()
  const { url } = yield* InternalEnv
  context.postMessage(FacadeIntroduction.make({}), url, [port2])
  return BrowserWorker.layer(() => port1)
}).pipe(Layer.unwrap)

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
