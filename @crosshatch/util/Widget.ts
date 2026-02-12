import { Effect, Option, Schema as S, Stream } from "effect"
import { getParentContext } from "./getParentContext.ts"

const DEFAULT_SANDBOX = "allow-scripts allow-same-origin allow-popups allow-forms"
const DEFAULT_ALLOW = "payment; clipboard-write; accelerometer; gyroscope; publickey-credentials-create *"

let currentZ = 100

export class Introduction extends S.TaggedClass<Introduction>()("Introduction", {}) {
  static decodeOption = S.decodeUnknownOption(this)
}

export class RequestIntroduction extends S.TaggedClass<RequestIntroduction>()("RequestIntroduction", {}) {
  static decodeOption = S.decodeUnknownOption(this)
}

export class Ready extends S.TaggedClass<Ready>()("Ready", {}) {
  static is = S.is(this)
}

export class Close extends S.TaggedClass<Close>()("Close", {}) {
  static decodeOption = S.decodeUnknownOption(this)
}

export interface WidgetConfig<A, I> {
  readonly src: string
  readonly event: S.Schema<A, I>
}

export const embed = <A, I>({ src, event }: WidgetConfig<A, I>) =>
  Stream.asyncScoped<A>(Effect.fn(function*(emit) {
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
    addEventListener("message", async ({ data, origin }) => {
      if (origin === expectedOrigin) {
        if (Option.isSome(RequestIntroduction.decodeOption(data))) {
          iframe.contentWindow?.postMessage(new Introduction(), origin)
        }
        const option = decodeOption(data)
        if (option._tag === "Some") {
          const { value } = option
          emit.single(value)
        }
        if (Option.isSome(Close.decodeOption(data))) end()
      }
    }, { signal })
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
  }))

export const popup = <A, I>({ src, event: schema }: WidgetConfig<A, I>) =>
  Stream.asyncScoped<A>((emit) => {
    const { origin: expectedOrigin } = new URL(src)
    const decodeOption = S.decodeUnknownOption(schema)
    const controller = new AbortController()
    const { signal } = controller
    const timeout = setInterval(async () => {
      if (context?.closed) {
        controller.abort()
        emit.end()
        clearTimeout(timeout) // TODO
      }
    }, 1)
    addEventListener("message", async ({ data, origin }) => {
      if (origin === expectedOrigin) {
        if (Option.isSome(RequestIntroduction.decodeOption(data))) {
          context?.postMessage(new Introduction(), origin)
        }
        const option = decodeOption(data)
        if (option._tag === "Some") {
          const { value } = option
          emit.single(value)
        }
        if (Option.isSome(Close.decodeOption(data))) {
          controller.abort()
          await emit.end()
        }
      }
    }, { signal })
    const context = open(src)
    return Effect.addFinalizer(() =>
      Effect.sync(() => {
        controller.abort()
        context?.close()
      })
    )
  })

export const closeSelf = (redirect?: string | undefined) => {
  const parentContext = getParentContext()
  if (parentContext) {
    parent.postMessage(new Close(), "*")
  } else if (redirect) {
    location.href = redirect
  }
}
