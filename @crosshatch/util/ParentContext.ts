import { Effect, Context, Deferred, Schema as S } from "effect"

import { tag } from "./tag.ts"

export const RequestIntroduction = S.TaggedStruct("RequestIntroduction", {})

export const Introduction = S.TaggedStruct("Introduction", {})

export const RelayedIntroduction = S.TaggedStruct("RelayedIntroduction", {
  origin: S.String,
})

export class Origin extends Context.Tag(tag("ParentContextOrigin"))<Origin, string>() {}

export const introduction = Effect.fn(function* (context: Window) {
  const deferred = yield* Deferred.make<string>()
  addEventListener("message", function f(message) {
    const { data, origin } = message
    if (S.is(Introduction)(data)) {
      Deferred.unsafeDone(deferred, Effect.succeed(origin))
      removeEventListener("message", f)
    }
  })
  context.postMessage(RequestIntroduction.make(), "*")
  return yield* Deferred.await(deferred)
})
