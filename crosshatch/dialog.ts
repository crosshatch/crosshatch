import { Deferred, Effect, Option, Schema as S } from "effect"
import { appUrl } from "./env.ts"
import { DialogClose, DialogReady, Introduction } from "./messages.ts"

export const dialog = Effect.fn(function*(href: string) {
  const dialogReady = yield* Deferred.make<void>()
  addEventListener("message", function f({ data, origin }: MessageEvent) {
    if (origin === appUrl && Option.isSome(S.decodeUnknownOption(DialogReady)(data))) {
      Deferred.unsafeDone(dialogReady, Effect.succeed(undefined))
      removeEventListener("message", f)
      iframe.contentWindow?.postMessage(new Introduction(), appUrl)
    }
  })
  const iframe = document.createElement("iframe")
  iframe.sandbox = "allow-scripts allow-same-origin"
  iframe.style.opacity = "0"
  iframe.src = href
  iframe.style.position = "fixed"
  iframe.style.top = "0"
  iframe.style.right = "0"
  iframe.style.bottom = "0"
  iframe.style.left = "0"
  iframe.style.width = "100vw"
  iframe.style.height = "100vh"
  iframe.style.zIndex = "100000"
  document.body.appendChild(iframe)
  yield* Deferred.await(dialogReady)
  iframe.style.opacity = "1"
  addEventListener("message", function f({ data, origin }: MessageEvent) {
    if (origin === appUrl && Option.isSome(S.decodeUnknownOption(DialogClose)(data))) {
      document.body.removeChild(iframe)
      removeEventListener("message", f)
    }
  })
})
