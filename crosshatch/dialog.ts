import { Deferred, Effect, Option, Schema as S } from "effect"
import { appUrl } from "./env.ts"
import { DialogClose, Introduction, RequestIntroduction } from "./messages.ts"

// TODO: make resolve to value of a specified schema
export const dialog = Effect.fn(function*(
  href: string,
) {
  const deferred = yield* Deferred.make<void>()
  addEventListener("message", function f({ data, origin }: MessageEvent) {
    if (origin === appUrl && Option.isSome(S.decodeUnknownOption(RequestIntroduction)(data))) {
      Deferred.unsafeDone(deferred, Effect.succeed(undefined))
      iframe.contentWindow?.postMessage(new Introduction(), appUrl)
    }
  })
  const iframe = document.createElement("iframe")
  iframe.sandbox = "allow-scripts allow-same-origin allow-popups"
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
  yield* Deferred.await(deferred)
  iframe.style.opacity = "1"
  addEventListener("message", function f({ data, origin }: MessageEvent) {
    if (origin === appUrl && Option.isSome(S.decodeUnknownOption(DialogClose)(data))) {
      document.body.removeChild(iframe)
      removeEventListener("message", f)
    }
  })
})
