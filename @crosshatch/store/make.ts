import type { PGlite } from "@electric-sql/pglite"
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core"
import type { AnyPgSelectQueryBuilder } from "drizzle-orm/pg-core"
import { PgRelationalQuery } from "drizzle-orm/pg-core/query-builders/query"
import { drizzle } from "drizzle-orm/pglite"
import type { PgliteDatabase } from "drizzle-orm/pglite"
import { Effect, Fiber, Layer, Record, Stream } from "effect"
import { Database, DatabaseError, DatabaseWorker, Drizzle } from "./Database.ts"

export const make = <S extends Record<string, unknown>>(schema: S) =>
  class {
    static _ = Drizzle as never as Effect.Effect<ReturnType<typeof drizzle<S>>, never, Drizzle>

    static f = Effect.fn("f")(function*<T extends PromiseLike<any>>(
      x: T | ((_: Drizzle["Type"]) => T),
    ): Effect.fn.Return<Awaited<T>, DatabaseError, Drizzle> {
      const _ = yield* Drizzle
      return yield* Effect.tryPromise({
        try: () => (typeof x === "function" ? x(_) : x).then(),
        catch: (cause) => new DatabaseError({ cause }),
      })
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

    // TODO: clean this up!
    static tx = Effect.fn("tx")(
      function*<A, E, R>(f: (tx: PgTransaction<PgQueryResultHKT, S>) => Effect.Effect<A, E, R>) {
        const _ = yield* Drizzle
        let tx: PgTransaction<PgQueryResultHKT, S, Record<string, never>> = null!
        const latch = yield* Effect.makeLatch(false)
        const { promise, resolve } = Promise.withResolvers<void>()
        const fiber = yield* Effect.tryPromise({
          try: () =>
            _.transaction(async (tx_) => {
              tx = tx_ as never
              latch.unsafeOpen()
              await promise
            }),
          catch: (cause) => new DatabaseError({ cause }),
        }).pipe(
          Effect.fork,
        )
        yield* latch.await
        const result = yield* f(tx)
        resolve()
        yield* Fiber.join(fiber)
        return result
      },
    )

    static latest = <
      A extends (Partial<AnyPgSelectQueryBuilder> & Pick<AnyPgSelectQueryBuilder, "_">) | PgRelationalQuery<any>,
    >(
      f: (_: PgliteDatabase<S>) => A,
    ): Stream.Stream<A["_"]["result"], DatabaseError, Drizzle | Database> => {
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
          const query = yield* Effect.tryPromise({
            try: () => client.live.query(sql, params, ({ rows }) => emit.single(mapper(rows))),
            catch: (cause) => new DatabaseError({ cause }),
          })
          yield* Effect.addFinalizer(() => Effect.promise(() => query.unsubscribe()))
        }),
      ).pipe(
        Stream.withSpan("latest"),
      )
    }
  }
