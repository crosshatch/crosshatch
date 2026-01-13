import type { PgDatabase, PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core"
import { Effect, Fiber } from "effect"

export const txFactory = <
  T extends Record<string, unknown>,
  E,
  R,
>(
  _schema: T,
  drizzle: Effect.Effect<PgDatabase<PgQueryResultHKT, T>, E, R>,
) =>
  Effect.fn(
    function*<A, E, R>(f: (tx: PgTransaction<PgQueryResultHKT, T>) => Effect.Effect<A, E, R>) {
      const _ = yield* drizzle
      let tx: PgTransaction<PgQueryResultHKT, T, Record<string, never>> = null!
      const latch = yield* Effect.makeLatch(false)
      const { promise, resolve } = Promise.withResolvers<void>()
      const fiber = yield* Effect.tryPromise(() =>
        _.transaction(async (tx_) => {
          tx = tx_ as never
          latch.unsafeOpen()
          await promise
        })
      ).pipe(
        Effect.fork,
      )
      yield* latch.await
      const result = yield* f(tx).pipe(
        Effect.onError(() =>
          Effect.sync(() => {
            resolve()
            tx.rollback()
          })
        ),
      )
      resolve()
      yield* Fiber.join(fiber)
      return result
    },
  )
