import { Effect } from "effect"

export const get =
  <A, K extends keyof A>(key: K) =>
  <E, R>(effect: Effect.Effect<A, E, R>) =>
    effect.pipe(Effect.map((v) => v[key]))

export const nonNullable = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(Effect.flatMap(Effect.fromNullishOr))
