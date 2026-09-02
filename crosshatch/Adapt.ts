import { type Schema as S, type Effect, Data } from "effect"

export class AdaptError extends Data.TaggedError("AdaptError")<{}> {}

export type AdaptEffect<R> = Effect.Effect<S.JsonObject, AdaptError, R>
