import { Context, Deferred, Effect, flow, Layer, Semaphore, Stream, SubscriptionRef } from "effect"

import { FacadeClient } from "./FacadeClient.ts"
import type { FacadeState } from "./FacadeState.ts"

export class CurrentFacadeState extends Context.Service<CurrentFacadeState>()("crosshatch/Browser/FacadeState", {
  make: Effect.gen(function* () {
    const task = yield* Semaphore.make(1).pipe(Effect.map((v) => Semaphore.withPermits(v, 1)))
    const initialDeferred = yield* Deferred.make<FacadeState>()
    const facade = yield* FacadeClient
    yield* facade.StreamState().pipe(
      Stream.runForEach(
        flow(
          (v) =>
            Deferred.isDone(initialDeferred).pipe(
              Effect.flatMap((done) => (done ? SubscriptionRef.set(ref, v) : Deferred.succeed(initialDeferred, v))),
            ),

          task,
        ),
      ),
      Effect.forkScoped,
    )
    const initial = yield* Deferred.await(initialDeferred)
    const ref = yield* SubscriptionRef.make(initial)
    return ref
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
