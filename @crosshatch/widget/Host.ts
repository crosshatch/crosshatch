import { BrowserStream } from "@effect/platform-browser"
import { Exit, Schema as S, Context, Stream, Effect, Scope, Deferred, Layer } from "effect"

import { parent } from "./self.ts"

export class Host extends Context.Service<Host, string>()("@crosshatch/widget/Host") {}

export const RequestHostIntroduction = S.TaggedStruct("RequestHostIntroduction", {})

export const HostIntroduction = S.TaggedStruct("HostIntroduction", {})

export const hostListener = Effect.suspend(() =>
  BrowserStream.fromEventListenerWindow("message").pipe(
    Stream.runForEach(
      Effect.fnUntraced(function* ({ data, origin, source }) {
        if (S.is(RequestHostIntroduction)(data)) {
          source?.postMessage(HostIntroduction.make({}), { targetOrigin: origin })
        }
      }),
    ),
  ),
)

export const layer = Effect.gen(function* () {
  const deferred = yield* Deferred.make<string>()
  const scope = yield* Scope.make()
  yield* BrowserStream.fromEventListenerWindow("message").pipe(
    Stream.runForEach(
      Effect.fnUntraced(function* ({ data, origin }) {
        if (S.is(HostIntroduction)(data)) {
          yield* Deferred.succeed(deferred, origin)
          yield* Scope.close(scope, Exit.void)
        }
      }),
    ),
    Effect.forkScoped,
    Scope.provide(scope),
  )
  parent.postMessage(RequestHostIntroduction.make({}), "*")
  return yield* Deferred.await(deferred)
}).pipe(Layer.effect(Host))
