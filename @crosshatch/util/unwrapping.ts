import { Cause, Effect, Types } from "effect"

export const unwrap = <A, E, R>(x: Effect.Effect<A, E, R>) => Effect.flatMap(x, Effect.fromNullable)

export const unwrapE0 = <A, E, R>(x: Effect.Effect<Array<A>, E, R>) =>
  Effect.flatMap(x, ([e0]) => Effect.fromNullable(e0))

export const unwrapSlice = <N extends number>(n: N) => <A, E, R>(x: Effect.Effect<Array<A>, E, R>) =>
  Effect.flatMap(
    x,
    (v) => v.length < n ? new Cause.NoSuchElementException() : Effect.succeed(v.slice(0, n) as Types.TupleOf<N, A>),
  )

export const unwrapPredicate = <A, A2 extends A, E, R, E2>(
  predicate: (value: A) => value is A2,
  makeError: (value: A) => E2,
) =>
(
  x: Effect.Effect<A, E, R>,
) =>
  Effect.flatMap(x, (value) =>
    predicate(value)
      ? Effect.succeed(value)
      : Effect.fail(makeError(value)))
