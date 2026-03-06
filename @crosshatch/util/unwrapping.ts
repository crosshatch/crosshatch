import { Cause, Effect, Types } from "effect"

export const e0 = <A, E, R>(effect: Effect.Effect<Array<A>, E, R>): Effect.Effect<A | undefined, E, R> =>
  Effect.map(effect, ([v]) => v)

export const access =
  <A, K extends keyof A>(key: K) =>
  <E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.map(effect, (v) => v[key])

export const slice =
  <N extends number>(n: N) =>
  <A, E, R>(effect: Effect.Effect<Array<A>, E, R>): Effect.Effect<Types.TupleOf<N, A> | undefined, E, R> =>
    Effect.map(effect, (v) => (v.length >= n ? (v.slice(0, n) as never) : undefined))

export const nonNullable = <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.flatMap(effect, Effect.fromNullable)

export const nullable = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  Effect.catchTags(effect, {
    NoSuchElementException: () => Effect.succeed(undefined),
  })

export const nullableError =
  <C>(c: new () => C) =>
  <A, E, R>(effect: Effect.Effect<A, E | Cause.NoSuchElementException, R>) =>
    effect.pipe(Effect.catchTag("NoSuchElementException", () => Effect.fail(new c())))

export const nonEmpty = <A>(effect: Array<A>): Effect.Effect<[A, ...Array<A>], Cause.NoSuchElementException> =>
  Effect.fromNullable(effect[0]).pipe(
    Effect.map((e0) => {
      const [_0, ...rest] = effect
      return [e0, ...rest]
    }),
  )
