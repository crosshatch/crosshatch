import { Effect, Stream, Layer, SubscriptionRef, Deferred, Semaphore, flow } from "effect"

import { FacadeClient } from "./FacadeClient.ts"
import { FacadeState } from "./FacadeState.ts"

const FacadeStateLive = Layer.effect(
  FacadeState,
  Effect.gen(function* () {
    const task = yield* Semaphore.make(1).pipe(Effect.map((v) => Semaphore.withPermits(v, 1)))
    const initialDeferred = yield* Deferred.make<FacadeState>()
    const facade = yield* FacadeClient
    yield* facade
      .StreamState()
      .pipe(
        Stream.runForEach(
          flow(
            (value) =>
              Deferred.isDone(initialDeferred)
                ? SubscriptionRef.set(ref, value)
                : Deferred.succeed(initialDeferred, value),
            task,
          ),
        ),
        Effect.forkScoped,
      )
    const initial = yield* Deferred.await(initialDeferred)
    const ref = yield* SubscriptionRef.make(initial)
    return ref
  }),
)

export const layer = FacadeStateLive.pipe(Layer.provideMerge(FacadeClient.layer))
