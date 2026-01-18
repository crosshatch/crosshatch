import { BrowserWorker } from "@effect/platform-browser"
import { Deferred, Effect, Layer, Option, Schema as S } from "effect"
import { appUrl } from "./env.ts"
import { EnclaveProxyReady, SatelliteReady } from "./messages.ts"

const style = Object
  .entries({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
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
  const enclaveReady = yield* Deferred.make<void>()
  addEventListener("message", function f({ data, origin }: MessageEvent) {
    if (origin === appUrl && Option.isSome(S.decodeUnknownOption(EnclaveProxyReady)(data))) {
      Deferred.unsafeDone(enclaveReady, Effect.succeed(undefined))
      removeEventListener("message", f)
    }
  })
  const iframe = document.createElement("iframe")
  Object.assign(iframe, {
    sandbox: "allow-scripts allow-same-origin",
    src: `${appUrl}/bridge`,
    width: 1,
    height: 1,
    style,
  })
  document.body.appendChild(iframe)
  yield* Deferred.await(enclaveReady)
  const context = yield* Effect.fromNullable(iframe.contentWindow)
  const channel = new MessageChannel()
  context.postMessage(new SatelliteReady(), "*", [channel.port2])
  return BrowserWorker.layerPlatform(() => channel.port1)
}).pipe(
  Layer.unwrapEffect,
)
