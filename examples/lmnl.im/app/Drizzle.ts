import type { AnyPgAsyncRelationalQuery, AnyPgAsyncSelect } from "drizzle-orm/pg-core"

import { live } from "@electric-sql/pglite/live"
import { PGliteWorker } from "@electric-sql/pglite/worker"
import { drizzle } from "drizzle-orm/pglite"
import { Cause, Effect, Stream, Context, Layer, Queue } from "effect"

// oxlint-disable-next-line import/default
import PgWorker from "./PgWorker.ts?worker"
import { relations } from "./relations.ts"
import * as schema from "./schema.ts"

export class PgliteClient extends Context.Service<PgliteClient>()("PgliteClient", {
  make: Effect.gen(function* () {
    const client = yield* Effect.tryPromise(() => PGliteWorker.create(new PgWorker(), { extensions: { live } }))
    yield* Effect.addFinalizer(() => Effect.promise(() => client.close()))
    yield* Effect.tryPromise(() => client.waitReady)
    return client
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}

export class Drizzle extends Context.Service<Drizzle>()("Drizzle", {
  make: Effect.gen(function* () {
    const pg = yield* PgliteClient
    return drizzle({
      client: pg as never,
      relations,
      schema,
    })
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}

type Preparable = AnyPgAsyncRelationalQuery | AnyPgAsyncSelect

export const latest = <T extends Partial<Preparable> & Pick<Preparable, "prepare" | "_">>(
  f: (_: Drizzle["Service"]) => T,
): Stream.Stream<T["_"]["result"], Cause.UnknownError, Drizzle | PgliteClient> =>
  Effect.gen(function* () {
    const _ = yield* Drizzle
    const built = f(_)
    const prepared = built.prepare("")
    const { sql, params } = built.toSQL!()
    return Effect.gen(function* () {
      const pg = yield* PgliteClient
      return Stream.callback<Array<{ [key: string]: any }>, Cause.UnknownError>(
        Effect.fn(function* (queue) {
          const query = yield* Effect.tryPromise(() =>
            pg.live.query(sql, params, ({ rows }) => Queue.offerUnsafe(queue, rows)),
          )
          yield* Effect.addFinalizer(() => Effect.promise(() => query.unsubscribe()))
        }),
      )
    }).pipe(
      Stream.unwrap,
      Stream.map((rows) => prepared.mapResult(rows)),
    )
  }).pipe(Stream.unwrap)
