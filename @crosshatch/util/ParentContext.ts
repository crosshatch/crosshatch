import { Effect, Deferred, Schema as S } from "effect"

export const RequestIntroduction = S.TaggedStruct("RequestIntroduction", {})

export const Introduction = S.TaggedStruct("Introduction", {})

export const RelayedIntroduction = S.TaggedStruct("RelayedIntroduction", {
  origin: S.String,
})

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
