import { Effect, type Types } from "effect"

export const get =
  <A, K extends keyof A>(key: K) =>
  <E, R>(effect: Effect.Effect<A, E, R>) =>
    effect.pipe(Effect.map((v) => v[key]))

export const slice =
  <N extends number>(n: N) =>
  <A, E, R>(effect: Effect.Effect<Array<A>, E, R>): Effect.Effect<Types.TupleOf<N, A> | undefined, E, R> =>
    effect.pipe(Effect.map((v) => (v.length >= n ? (v.slice(0, n) as never) : undefined)))

export const nonNullable = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(Effect.flatMap(Effect.fromNullishOr))
