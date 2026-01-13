import type { PGlite } from "@electric-sql/pglite"
import type { AnyPgSelectQueryBuilder } from "drizzle-orm/pg-core"
import { PgRelationalQuery } from "drizzle-orm/pg-core/query-builders/query"
import { drizzle } from "drizzle-orm/pglite"
import type { PgliteDatabase } from "drizzle-orm/pglite"
import { Cause, Effect, Layer, Record, Stream } from "effect"
import { Database, DatabaseWorker, Drizzle } from "./Database.ts"

export const make = <S extends Record<string, unknown>>(schema: S) =>
  class {
    static _ = Drizzle as never as Effect.Effect<ReturnType<typeof drizzle<S>>, never, Drizzle>

    static f = Effect.fn("f")(function*<T extends PromiseLike<any>>(
      x: T | ((_: Drizzle["Type"]) => T),
    ): Effect.fn.Return<Awaited<T>, Cause.UnknownException, Drizzle> {
      const _ = yield* Drizzle
      return yield* Effect.tryPromise(() => (typeof x === "function" ? x(_) : x).then())
    })

    static layer = (Worker: DatabaseWorker["Type"]) =>
      Layer.effect(
        Drizzle,
        Effect.gen(function*() {
          const client = (yield* Database) as never as PGlite
          return drizzle({
            client,
            schema,
          })
        }),
      ).pipe(
        Layer.provideMerge(Database.layer.pipe(
          Layer.provide(
            Layer.succeed(DatabaseWorker, Worker),
          ),
        )),
      )

    static latest = <
      A extends (Partial<AnyPgSelectQueryBuilder> & Pick<AnyPgSelectQueryBuilder, "_">) | PgRelationalQuery<any>,
    >(
      f: (_: PgliteDatabase<S>) => A,
    ): Stream.Stream<A["_"]["result"], Cause.UnknownException, Drizzle | Database> => {
      const self = this
      return Stream.asyncScoped(
        Effect.fn(function*(emit) {
          const client = yield* Database
          const built = f(yield* self._)
          const { sql, params } = built.toSQL!()
          const mapper: (rows_: Array<{ [key: string]: unknown }>) => any = built instanceof PgRelationalQuery
            ? (() => {
              const prepared = built.prepare("")
              return (rows) => prepared.mapResult(rows)
            })()
            : (rows) =>
              rows.map((row) =>
                Record.map(
                  built._.selectedFields,
                  (col: {
                    name: string
                    mapFromDriverValue: (value: unknown) => unknown
                  }) => col.mapFromDriverValue(row[col.name]),
                )
              )
          const query = yield* Effect.tryPromise(() =>
            client.live.query(sql, params, ({ rows }) => emit.single(mapper(rows)))
          )
          yield* Effect.addFinalizer(() => Effect.promise(() => query.unsubscribe()))
        }),
      ).pipe(
        Stream.withSpan("latest"),
      )
    }
  }
