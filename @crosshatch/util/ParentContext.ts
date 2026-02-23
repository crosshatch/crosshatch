import { Effect, Option, Context, Deferred, Layer, Schema as S } from "effect"

import { tag } from "./tag.ts"

export class Introduction extends S.TaggedClass<Introduction>()("Introduction", {}) {
  static readonly decodeOption = S.decodeUnknownOption(this)
}

export class RequestIntroduction extends S.TaggedClass<RequestIntroduction>()("RequestIntroduction", {}) {
  static readonly decodeOption = S.decodeUnknownOption(this)
}

export const getOrUndefined = () => {
  try {
    if (globalThis.self !== globalThis.top) {
      return globalThis.top
    }
    // oxlint-disable-next-line no-unused-vars
  } catch (_e: unknown) {}
  return null
}

export class Origin extends Context.Tag(tag("ParentContextOrigin"))<Origin, string | undefined>() {}

export const layerOrigin = Effect.gen(function* () {
  const parentContext = getOrUndefined()
  if (parentContext) {
    const deferred = yield* Deferred.make<string>()
    addEventListener("message", function f(message) {
      const { data, origin } = message
      if (Option.isSome(Introduction.decodeOption(data))) {
        Deferred.unsafeDone(deferred, Effect.succeed(origin))
        removeEventListener("message", f)
      }
    })
    parentContext.postMessage(new RequestIntroduction(), "*")
    return yield* Deferred.await(deferred)
  }
  return undefined
}).pipe(Layer.effect(Origin))
