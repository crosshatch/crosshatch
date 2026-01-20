import { Data, Effect, Stream } from "effect"
import { PgliteClient } from "./PgliteClient.ts"

export class LatestError extends Data.TaggedError("LatestError")<{
  cause: unknown
}> {}

export const latest = ({ sql, params }: {
  readonly sql: string
  readonly params: Array<unknown>
}) =>
  Effect.gen(function*() {
    const pg = yield* PgliteClient
    return Stream.asyncScoped<Array<{ [key: string]: any }>, LatestError>(Effect.fn(function*(emit) {
      const query = yield* Effect.tryPromise({
        try: () => pg.live.query(sql, params, ({ rows }) => emit.single(rows)),
        catch: (cause) => new LatestError({ cause }),
      })
      yield* Effect.addFinalizer(() => Effect.promise(() => query.unsubscribe()))
    }))
  }).pipe(
    Stream.unwrapScoped,
  )
