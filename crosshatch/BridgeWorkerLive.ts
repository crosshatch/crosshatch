import * as Widget from "@crosshatch/util/Widget"
import { BrowserWorker } from "@effect/platform-browser"
import { Deferred, Effect, Layer, Option, Schema as S } from "effect"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { AppReady, BridgeReady } from "./messages.ts"

const cssText = Object.entries({
  position: "absolute",
  padding: 0,
  bottom: "-1px",
  left: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  border: 0,
  pointerEvents: "none",
  opacity: 0,
})
  .map(([k, v]) => `${k}: ${v};`)
  .join(" ")

export const BridgeWorkerLive = Effect.gen(function* () {
  const bridgeReady = yield* Deferred.make<void>()
  const env = yield* CrosshatchEnv
  addEventListener("message", function f({ data, origin }: MessageEvent) {
    if (env.isCrosshatch(origin) && Option.isSome(S.decodeUnknownOption(BridgeReady)(data))) {
      Deferred.unsafeDone(bridgeReady, Effect.void)
      removeEventListener("message", f)
    }
  })
  const contextReady = Promise.withResolvers<void>()
  addEventListener("message", async function f({ data, origin }: MessageEvent) {
    if (env.isCrosshatch(origin) && Option.isSome(Widget.RequestIntroduction.decodeOption(data))) {
      await contextReady.promise
      context.postMessage(new Widget.Introduction(), "*")
      removeEventListener("message", f)
    }
  })
  const iframe = document.createElement("iframe")
  Object.assign(iframe, {
    sandbox: "allow-scripts allow-same-origin",
    src: env.href("bridge"),
    width: 1,
    height: 1,
  })
  Object.assign(iframe.style, { cssText })
  document.body.appendChild(iframe)
  yield* Deferred.await(bridgeReady)
  const context = yield* Effect.fromNullable(iframe.contentWindow)
  contextReady.resolve()
  const channel = new MessageChannel()
  context.postMessage(new AppReady(), "*", [channel.port2])
  return BrowserWorker.layerPlatform(() => channel.port1)
}).pipe(Layer.unwrapEffect)
