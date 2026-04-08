import { live } from "@electric-sql/pglite/live"
import { PGliteWorker } from "@electric-sql/pglite/worker"
import type { AnyPgAsyncRelationalQuery, AnyPgAsyncSelect } from "drizzle-orm/pg-core"
import { drizzle } from "drizzle-orm/pglite"
import { Cause, Effect, Stream } from "effect"

// oxlint-disable-next-line import/default
import PgWorker from "./PgWorker.ts?worker"
import { relations } from "./relations.ts"
import * as schema from "./schema.ts"

export class PgliteClient extends Effect.Service<PgliteClient>()("PgliteClient", {
  scoped: Effect.gen(function* () {
    const client = yield* Effect.tryPromise(() => PGliteWorker.create(new PgWorker(), { extensions: { live } }))
    yield* Effect.addFinalizer(() => Effect.promise(() => client.close()))
    yield* Effect.tryPromise(() => client.waitReady)
    return client
  }),
}) {}

export class Drizzle extends Effect.Service<Drizzle>()("Drizzle", {
  scoped: Effect.gen(function* () {
    const pg = yield* PgliteClient
    return drizzle({
      client: pg as never,
      relations,
      schema,
    })
  }),
}) {}

type Preparable = AnyPgAsyncRelationalQuery | AnyPgAsyncSelect

export const latest = <T extends Partial<Preparable> & Pick<Preparable, "prepare" | "_">>(
  f: (_: Drizzle) => T,
): Stream.Stream<T["_"]["result"]> =>
  Effect.gen(function* () {
    const _ = yield* Drizzle
    const built = f(_)
    const prepared = built.prepare("")
    const { sql, params } = built.toSQL!()
    return Effect.gen(function* () {
      const pg = yield* PgliteClient
      return Stream.asyncScoped<Array<{ [key: string]: any }>, Cause.UnknownException>(
        Effect.fn(function* (emit) {
          const query = yield* Effect.tryPromise(() => pg.live.query(sql, params, ({ rows }) => emit.single(rows)))
          yield* Effect.addFinalizer(() => Effect.promise(() => query.unsubscribe()))
        }),
      )
    }).pipe(
      Stream.unwrapScoped,
      Stream.map((rows) => prepared.mapResult(rows)),
    )
  }).pipe(Stream.unwrap) as never
