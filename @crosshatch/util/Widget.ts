import { Effect, Option, Schema as S, Stream } from "effect"
import { getParentContext } from "./getParentContext.ts"

const DEFAULT_SANDBOX = "allow-scripts allow-same-origin allow-popups allow-forms"
const DEFAULT_ALLOW = "payment; clipboard-write; accelerometer; gyroscope"

let currentZ = 100

export class Introduction extends S.TaggedClass<Introduction>("Introduction")("Introduction", {}) {
  static decodeOption = S.decodeUnknownOption(this)
}

export class RequestIntroduction
  extends S.TaggedClass<RequestIntroduction>("RequestIntroduction")("RequestIntroduction", {})
{
  static decodeOption = S.decodeUnknownOption(this)
}

export class Close extends S.TaggedClass<Close>("Close")("Close", {}) {
  static decodeOption = S.decodeUnknownOption(this)
}

export const make = <A, I>({
  src,
  schema,
  matchReady,
  sandbox = DEFAULT_SANDBOX,
  allow = DEFAULT_ALLOW,
}: {
  readonly src: string
  readonly schema: S.Schema<A, I>
  readonly matchReady?: (v: A) => boolean
  readonly sandbox?: string | undefined
  readonly allow?: string | undefined
}) =>
  Stream.asyncScoped<A>(Effect.fn(function*(emit) {
    const { origin: expectedOrigin } = new URL(src)
    const decodeOption = S.decodeUnknownOption(schema)
    const controller = new AbortController()
    const { signal } = controller
    addEventListener("message", async ({ data, origin }) => {
      if (origin === expectedOrigin) {
        if (Option.isSome(RequestIntroduction.decodeOption(data))) {
          iframe.contentWindow?.postMessage(new Introduction(), origin)
        }
        const option = decodeOption(data)
        if (option._tag === "Some") {
          const { value } = option
          if (matchReady?.(value)) {
            iframe.style.opacity = "1"
          }
          emit.single(value)
        }
        if (Option.isSome(Close.decodeOption(data))) {
          controller.abort()
          await emit.end()
        }
      }
    }, { signal })
    const iframe = document.createElement("iframe")
    iframe.sandbox = sandbox
    iframe.allow = allow
    iframe.style.transition = "opacity 1s ease"
    iframe.src = src
    if (matchReady) {
      iframe.style.opacity = "0"
    }
    iframe.style.position = "fixed"
    iframe.style.top = "0"
    iframe.style.right = "0"
    iframe.style.bottom = "0"
    iframe.style.left = "0"
    iframe.style.width = "100vw"
    iframe.style.height = "100vh"
    iframe.style.zIndex = `${currentZ++}`
    iframe.referrerPolicy = "no-referrer"
    document.body.appendChild(iframe)
    yield* Effect.addFinalizer(() =>
      Effect.sync(() => {
        controller.abort()
        document.body.removeChild(iframe)
      })
    )
  }))

export const closeSelf = (redirect: string) => {
  const parentContext = getParentContext()
  if (parentContext) {
    parent.postMessage(new Close(), "*")
  } else {
    location.href = redirect
  }
}
