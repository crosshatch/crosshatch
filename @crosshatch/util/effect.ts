import { Cause, Effect, Layer, Logger, LogLevel, Types } from "effect"
import { config } from "./config.ts"

export const ensureE0 = <A, E, R>(
  x: Effect.Effect<Array<A>, E, R>,
): Effect.Effect<A, E | Cause.NoSuchElementException, R> => Effect.flatMap(x, ([e0]) => Effect.fromNullable(e0))

export const ensureSlice = <N extends number>(n: N) =>
<A, E, R>(
  x: Effect.Effect<Array<A>, E, R>,
): Effect.Effect<Types.TupleOf<N, A>, E | Cause.NoSuchElementException, R> =>
  Effect.flatMap(
    x,
    (v) => v.length < n ? new Cause.NoSuchElementException() : Effect.succeed(v.slice(0, n) as Types.TupleOf<N, A>),
  )

export const LoggerLive = config.dev.pipe(
  Effect.map((dev) =>
    dev
      ? Layer.mergeAll(
        Logger.pretty,
        Logger.minimumLogLevel(LogLevel.Debug),
      )
      : Layer.empty
  ),
  Layer.unwrapEffect,
)

export const prefix = <K extends string>(key: K) => `@crosshatch/${key}` as const
