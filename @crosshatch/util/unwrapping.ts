import { Cause, Effect, Struct, Types } from "effect"

export const e0 = <A, E, R>(x: Effect.Effect<Array<A>, E, R>): Effect.Effect<A | undefined, E, R> =>
  Effect.map(x, ([v]) => v)

export const access = <A, K extends keyof A>(key: K) => <E, R>(x: Effect.Effect<A, E, R>) =>
  Effect.map(x, Struct.get(key))

export const slice =
  <N extends number>(n: N) =>
  <A, E, R>(x: Effect.Effect<Array<A>, E, R>): Effect.Effect<Types.TupleOf<N, A> | undefined, E, R> =>
    Effect.map(x, (v) => v.length > n ? v.slice(0, n) as never : undefined)

export const nonNullable = <A, E, R>(x: Effect.Effect<A, E, R>) => Effect.flatMap(x, Effect.fromNullable)

export const nullable = <A, E, R>(x: Effect.Effect<A, E, R>) =>
  Effect.catchTags(x, {
    NoSuchElementException: () => Effect.succeed(undefined),
  })

export const nullableError =
  <C>(c: new() => C) => <A, E, R>(x: Effect.Effect<A, E | Cause.NoSuchElementException, R>) =>
    x.pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(new c())))
