import type { AnyRelations, SQLWrapper } from "drizzle-orm"

import { NodeServices } from "@effect/platform-node"
import { PgClient } from "@effect/sql-pg"
import { pushSchema } from "drizzle-kit/api-postgres"
import { DefaultServices, make } from "drizzle-orm/effect-postgres"
import { Config, Console, Effect, Schedule } from "effect"
import { SqlClient } from "effect/unstable/sql"

export const dev = <TSchema extends Record<string, unknown>, TRelationConfigs extends AnyRelations>({
  relations,
  schema,
}: {
  schema: TSchema
  relations: TRelationConfigs
}) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient
    yield* Console.log("[migrator] start")
    yield* Console.log("[migrator] wait for db")
    yield* sql`select 1`.pipe(
      Effect.tapError((error) => Console.error("[migrator] db check failed", error)),
      Effect.retry(Schedule.spaced("500 millis").pipe(Schedule.both(Schedule.recurs(60)))),
    )
    yield* Console.log("[migrator] db ready")
    yield* sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    const _ = yield* make({ relations, schema })
    const context = yield* Effect.context()
    const runPromise = Effect.runPromiseWith(context)
    const pushStart = Date.now()
    yield* Console.log("[migrator] pushSchema start")
    const pushResult = yield* Effect.tryPromise(() =>
      pushSchema(schema, {
        execute: (query: SQLWrapper | string) => {
          const queryStart = Date.now()
          return runPromise(
            _.execute(query)
              .asEffect()
              .pipe(
                Effect.tap(() => Console.log(`[migrator] query ok (${Date.now() - queryStart}ms): ${String(query)}`)),
                Effect.tapError((error) =>
                  Console.error(`[migrator] query error (${Date.now() - queryStart}ms): ${String(query)}`, error),
                ),
                Effect.map((rows) => ({ rows })),
              ),
          )
        },
      } as never),
    ).pipe(Effect.timeout("30 seconds"))
    yield* Console.log(`[migrator] pushSchema done (${Date.now() - pushStart}ms)`)
    if (pushResult.hints.length > 0) {
      yield* Console.log(JSON.stringify(pushResult.hints, null, 2))
    }
    const applyStart = Date.now()
    yield* Console.log("[migrator] apply start")
    yield* Effect.tryPromise(() => pushResult.apply()).pipe(Effect.timeout("30 seconds"))
    yield* Console.log(`[migrator] apply done (${Date.now() - applyStart}ms)`)
    yield* Console.log("[migrator] done")
  }).pipe(
    Effect.provide([
      DefaultServices,
      PgClient.layerConfig({
        url: Config.redacted("CHX_DATABASE_URL"),
      }),
      NodeServices.layer,
    ]),
    Effect.runFork,
  )
