import { Effect, pipe } from "effect"

export const logErrorDie = <A, E, R>(x: Effect.Effect<A, E, R>) =>
  pipe(x, Effect.tapErrorCause(Effect.logError), Effect.orDie)
