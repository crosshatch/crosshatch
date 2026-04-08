import type { PgAsyncTransaction, PgQueryResultHKT } from "drizzle-orm/pg-core"
import { Effect, Fiber } from "effect"

import { Drizzle } from "./Drizzle"
import type { relations } from "./relations"
import * as schema from "./schema"

export const tx = Effect.fn(function* <A, E, R>(
  f: (tx: PgAsyncTransaction<PgQueryResultHKT, typeof schema, typeof relations>) => Effect.Effect<A, E, R>,
) {
  const _ = yield* Drizzle
  let tx: PgAsyncTransaction<PgQueryResultHKT, typeof schema, typeof relations> = null!
  const latch = yield* Effect.makeLatch(false)
  const { promise, resolve } = Promise.withResolvers<void>()
  const fiber = yield* Effect.tryPromise(() =>
    _.transaction(async (tx_) => {
      tx = tx_ as never
      latch.unsafeOpen()
      await promise
    }),
  ).pipe(Effect.fork)
  yield* latch.await
  const result = yield* f(tx).pipe(
    Effect.onError(() =>
      Effect.sync(() => {
        resolve()
        tx.rollback()
      }),
    ),
  )
  resolve()
  yield* Fiber.join(fiber)
  return result
})
