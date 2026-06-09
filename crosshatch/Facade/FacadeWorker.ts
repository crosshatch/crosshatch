import { CROSSHATCH_ID_URL, CrosshatchEnv } from "@crosshatch/util/CrosshatchEnv"
import * as Host from "@crosshatch/widget/Host"
import { BrowserWorker, BrowserStream } from "@effect/platform-browser"
import { Effect, Fiber, Layer, Stream, Schema as S, Schedule } from "effect"
import * as Boundary from "liminal-util/Boundary"

import { FacadeIntroduction, RequestFacadeIntroduction } from "./handshake.ts"

export const layer = Effect.gen(function* () {
  yield* Host.hostListener.pipe(Effect.forkScoped)
  const fiber = yield* BrowserStream.fromEventListenerWindow("message").pipe(
    Stream.filter(({ data, origin }) => origin.startsWith(CROSSHATCH_ID_URL) && S.is(RequestFacadeIntroduction)(data)),
    Stream.take(1),
    Stream.runDrain,
    Effect.forkScoped,
  )
  const iframe = document.createElement("iframe")
  const { url } = yield* CrosshatchEnv
  Object.assign(iframe, {
    id: "crosshatch-enclave",
    height: 1,
    sandbox: "allow-scripts allow-same-origin",
    src: url("id", "enclave"),
    width: 1,
  })
  Object.assign(iframe.style, { cssText })
  document.body.appendChild(iframe)
  yield* Fiber.join(fiber)
  const context = yield* Effect.fromNullishOr(iframe.contentWindow)
  const { port1, port2 } = new MessageChannel()
  context.postMessage(FacadeIntroduction.make({}), url("id"), [port2])
  yield* Effect.addFinalizer(() => Effect.sync(() => iframe.remove()))
  return BrowserWorker.layer(() => port1)
}).pipe(
  Boundary.span("make", import.meta.url),
  Effect.retry(Schedule.exponential("100 millis", 2).pipe(Schedule.jittered, Schedule.take(6))),
  Layer.unwrap,
)

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
