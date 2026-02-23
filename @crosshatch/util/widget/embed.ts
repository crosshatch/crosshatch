import { Effect, Option, Schema as S, Stream } from "effect"

import * as ParentContext from "../ParentContext.ts"
import { Close, type WidgetConfig } from "./self.ts"

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

export const embed = <A, I>({ src, event }: WidgetConfig<A, I>) =>
  Stream.asyncScoped<A>(
    Effect.fn(function* (emit) {
      const { origin: expectedOrigin } = new URL(src)
      const decodeOption = S.decodeUnknownOption(event)
      const controller = new AbortController()
      const { signal } = controller
      let ended = false
      const end = () => {
        if (!ended) {
          controller.abort()
          document.body.removeChild(iframe)
          emit.end()
        }
      }
      addEventListener(
        "message",
        async ({ data, origin }) => {
          if (origin === expectedOrigin) {
            if (Option.isSome(ParentContext.RequestIntroduction.decodeOption(data))) {
              iframe.contentWindow?.postMessage(new ParentContext.Introduction(), origin)
            }
            const option = decodeOption(data)
            if (option._tag === "Some") {
              const { value } = option
              emit.single(value)
            }
            if (Option.isSome(Close.decodeOption(data))) end()
          }
        },
        { signal },
      )
      const iframe = document.createElement("iframe")
      iframe.sandbox = DEFAULT_SANDBOX
      iframe.allow = DEFAULT_ALLOW
      iframe.src = src
      iframe.style.position = "fixed"
      iframe.style.top = "0"
      iframe.style.right = "0"
      iframe.style.bottom = "0"
      iframe.style.left = "0"
      iframe.style.width = "100vw"
      iframe.style.height = "100vh"
      iframe.style.zIndex = `${currentZ++}`
      iframe.style.background = "transparent"
      iframe.referrerPolicy = "no-referrer"
      document.body.appendChild(iframe)
      yield* Effect.addFinalizer(() => Effect.sync(end))
    }),
  )
