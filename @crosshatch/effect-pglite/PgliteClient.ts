import { prefix } from "@crosshatch/util"
import { PgClient } from "@effect/sql-pg"
import { live, type PGliteWithLive } from "@electric-sql/pglite/live"
import { PGliteWorker } from "@electric-sql/pglite/worker"
import { Context, Data, Effect, Layer, Stream } from "effect"

export interface PgliteClient extends PgClient.PgClient {}

export class LiveQuery extends Context.Tag(prefix("effect-pglite/PgliteClient/LiveQuery"))<
  LiveQuery,
  (sql: string, params: Array<unknown>) => Stream.Stream<Array<{ [key: string]: any }>, LiveQueryError>
>() {}

export const liveQuery = ({ sql, params }: {
  sql: string
  params: Array<unknown>
}) =>
  Effect.gen(function*() {
    const query = yield* LiveQuery
    return query(sql, params)
  }).pipe(
    Stream.unwrap,
  )

export class LiveQueryError extends Data.TaggedError("LiveQueryError")<{
  cause: unknown
}> {}

export const layerWorker = (worker: new(options?: { name?: string }) => Worker) =>
  Effect.gen(function*() {
    const client = new PGliteWorker(new worker(), { extensions: { live } }) as never as PGliteWithLive
    yield* Effect.addFinalizer(() => Effect.promise(() => client.close()))
    yield* Effect.tryPromise(() => client.waitReady)
    // TODO: conversion
    const pg = null! as PgClient.PgClient
    return Layer.mergeAll(
      Layer.succeed(PgClient.PgClient, pg),
      Layer.succeed(LiveQuery, (sql, params) =>
        Stream.asyncScoped(Effect.fn(function*(emit) {
          const query = yield* Effect.tryPromise({
            try: () => client.live.query(sql, params, ({ rows }) => emit.single(rows)),
            catch: (cause) => new LiveQueryError({ cause }),
          })
          yield* Effect.addFinalizer(() => Effect.promise(() => query.unsubscribe()))
        }))),
    )
  }).pipe(
    Layer.unwrapScoped,
  )
