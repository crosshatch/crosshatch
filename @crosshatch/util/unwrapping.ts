import { Array, Cause, Effect, Stream, Types } from "effect"

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

export const nonNullable = <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.flatMap(effect, Effect.fromNullishOr)

export const nullable = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  Effect.catchTags(effect, {
    NoSuchElementException: () => Effect.succeed(undefined),
  })

export const nullableError =
  <C>(c: new () => C) =>
  <A, E, R>(effect: Effect.Effect<A, E | Cause.NoSuchElementError, R>) =>
    Effect.catchTag(effect, "NoSuchElementError", () => Effect.fail(new c()))

export const nonEmpty = <A, E, R>(
  effect: Effect.Effect<Array<A>, E, R>,
): Effect.Effect<Array.NonEmptyReadonlyArray<A>, Cause.NoSuchElementError | E, R> =>
  Effect.flatMap(
    effect,
    Effect.fn(function* ([e0_, ...rest]) {
      const e0 = yield* Effect.fromNullishOr(e0_)
      return [e0, ...rest]
    }),
  )

export const itemsNonNullable = <A, E, R>(
  stream: Stream.Stream<A, E, R>,
): Stream.Stream<NonNullable<A>, E | Cause.NoSuchElementError, R> => Stream.mapEffect(stream, Effect.fromNullishOr)

export const validateTag =
  <T extends { readonly _tag: string }, K extends Types.Tags<T>>(_tag: K) =>
  (value: T) =>
    Effect.succeed(value).pipe(
      Effect.filterOrFail(
        (v): v is Types.ExtractTag<T, K> => v._tag === _tag,
        () => new Cause.NoSuchElementError(),
      ),
    )
