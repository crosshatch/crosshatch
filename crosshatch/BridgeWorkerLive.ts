import * as Widget from "@crosshatch/util/Widget"
import { BrowserWorker } from "@effect/platform-browser"
import { Deferred, Effect, Layer, Option, Schema as S } from "effect"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { AppReady, BridgeReady } from "./messages.ts"

const style = Object
  .entries({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    bottom: "-1px",
    left: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    clipPath: "inset(50%)",
    border: 0,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    opacity: 0,
  })
  .map(([k, v]) => `${k}: ${v};`)
  .join(" ")

export const BridgeWorkerLive = Effect.gen(function*() {
  const { url, isCrosshatch } = yield* CrosshatchEnv
  const deferred = yield* Deferred.make<void>()
  addEventListener("message", function f({ data, origin }: MessageEvent) {
    if (isCrosshatch(origin) && Option.isSome(S.decodeUnknownOption(BridgeReady)(data))) {
      Deferred.unsafeDone(deferred, Effect.void)
      removeEventListener("message", f)
    }
  })
  // TODO: solve possible deadlock?
  addEventListener("message", function f({ data, origin }: MessageEvent) {
    if (isCrosshatch(origin) && Option.isSome(Widget.RequestIntroduction.decodeOption(data))) {
      context.postMessage(new Widget.Introduction(), "*")
      removeEventListener("message", f)
    }
  })
  const iframe = document.createElement("iframe")
  Object.assign(iframe, {
    sandbox: "allow-scripts allow-same-origin",
    src: `${url}/bridge`,
    width: 1,
    height: 1,
    style,
  })
  document.body.appendChild(iframe)
  yield* Deferred.await(deferred)
  const context = yield* Effect.fromNullable(iframe.contentWindow)
  const channel = new MessageChannel()
  context.postMessage(new AppReady(), "*", [channel.port2])
  return BrowserWorker.layerPlatform(() => channel.port1)
}).pipe(
  Layer.unwrapEffect,
)
