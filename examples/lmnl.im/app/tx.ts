import type { PgAsyncTransaction, PgQueryResultHKT } from "drizzle-orm/pg-core"

import { Effect, Fiber, Latch } from "effect"

import type { relations } from "./relations"

import { Drizzle } from "./Drizzle"
import * as schema from "./schema"

export const tx = Effect.fn(function* <A, E, R>(
  f: (tx: PgAsyncTransaction<PgQueryResultHKT, typeof schema, typeof relations>) => Effect.Effect<A, E, R>,
) {
  const _ = yield* Drizzle
  let tx: PgAsyncTransaction<PgQueryResultHKT, typeof schema, typeof relations> = null!
  const latch = yield* Latch.make(false)
  const { promise, resolve } = Promise.withResolvers<void>()
  const fiber = yield* Effect.tryPromise(() =>
    _.transaction(async (tx_) => {
      tx = tx_ as never
      Latch.openUnsafe(latch)
      await promise
    }),
  ).pipe(Effect.forkChild)
  yield* Latch.await(latch)
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
