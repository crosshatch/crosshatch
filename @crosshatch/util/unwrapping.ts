import { Cause, Effect, Stream, Types } from "effect"

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
    Effect.catchTag(effect, "NoSuchElementException", () => Effect.fail(new c()))

export const nonEmpty = <A, E, R>(
  effect: Effect.Effect<Array<A>, E, R>,
): Effect.Effect<[A, ...Array<A>], Cause.NoSuchElementException | E, R> =>
  Effect.flatMap(
    effect,
    Effect.fn(function* ([e0_, ...rest]) {
      const e0 = yield* Effect.fromNullable(e0_)
      return [e0, ...rest]
    }),
  )

export const itemsNonNullable = <A, E, R>(
  stream: Stream.Stream<A, E, R>,
): Stream.Stream<NonNullable<A>, E | Cause.NoSuchElementException, R> => Stream.mapEffect(stream, Effect.fromNullable)
