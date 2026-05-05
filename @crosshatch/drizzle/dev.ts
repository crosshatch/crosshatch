import type { AnyRelations, SQLWrapper } from "drizzle-orm"

import { NodeServices } from "@effect/platform-node"
import { PgClient } from "@effect/sql-pg"
import { pushSchema } from "drizzle-kit/api-postgres"
import { DefaultServices, make } from "drizzle-orm/effect-postgres"
import { Console, Effect, Schedule } from "effect"
import { SqlClient } from "effect/unstable/sql"
import { logCause } from "liminal-util/logCause"

const summarizeDatabaseUrl = (value: string | undefined) => {
  if (value === undefined || value.length === 0) {
    return { present: false }
  }
  try {
    const url = new URL(value)
    return {
      present: true,
      protocol: url.protocol,
      host: url.host,
      database: url.pathname.replace(/^\//, ""),
      username: url.username,
    }
  } catch {
    return {
      present: true,
      parseable: false,
      length: value.length,
    }
  }
}

const summarizePushResult = (value: unknown) => {
  if (value === null || typeof value !== "object") {
    return { type: typeof value }
  }
  const record = value as Record<string, unknown>
  return {
    keys: Object.keys(record),
    hints: record.hints,
    sqlStatements: record.sqlStatements,
    hasApply: typeof record.apply === "function",
  }
}

const summarizeQuery = (query: SQLWrapper | string) => {
  if (typeof query === "string") {
    return query
  }
  const record = query as unknown as Record<string, unknown>
  return JSON.stringify({
    type: query.constructor.name,
    keys: Object.keys(record),
  })
}

const makePgConfig = (value: string | undefined) => {
  if (value === undefined || value.length === 0) {
    throw new Error("[migrator] CHX_DATABASE_URL is missing")
  }
  const url = new URL(value)
  if (url.password.length > 0) {
    process.env.PGPASSWORD = url.password
  }
  return {
    host: url.hostname,
    port: url.port.length > 0 ? Number(url.port) : undefined,
    database: url.pathname.replace(/^\//, ""),
    username: url.username,
  }
}

export const dev = <TSchema extends Record<string, unknown>, TRelationConfigs extends AnyRelations>({
  relations,
  schema,
}: {
  schema: TSchema
  relations: TRelationConfigs
}) => {
  const databaseUrl = process.env.CHX_DATABASE_URL
  console.log("[migrator] bootstrap")
  console.log(`[migrator] CHX_DATABASE_URL ${JSON.stringify(summarizeDatabaseUrl(databaseUrl))}`)
  console.log(`[migrator] schema exports (${Object.keys(schema).length}): ${Object.keys(schema).join(", ")}`)
  return Effect.runPromise(
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient
      yield* Console.log("[migrator] start")
      yield* Console.log(`[migrator] CHX_DATABASE_URL ${JSON.stringify(summarizeDatabaseUrl(databaseUrl))}`)
      yield* Console.log(`[migrator] schema exports (${Object.keys(schema).length}): ${Object.keys(schema).join(", ")}`)
      if (databaseUrl === undefined || databaseUrl.length === 0) {
        return yield* Effect.die(new Error("[migrator] CHX_DATABASE_URL is missing"))
      }
      yield* Console.log("[migrator] wait for db")
      yield* sql`select 1`.pipe(
        Effect.tapError((error) => Console.error("[migrator] db check failed", error)),
        Effect.retry(Schedule.spaced("500 millis").pipe(Schedule.both(Schedule.recurs(60)))),
      )
      yield* Console.log("[migrator] db ready")
      yield* sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
      const constraintSnapshot = Effect.fn("migrator/constraintSnapshot")(function* (label: string) {
        const rows = yield* sql`
        select
          conname,
          confdeltype,
          pg_get_constraintdef(oid) as definition
        from pg_constraint
        where conname in (
          'derivations_mnemonic_id_mnemonics_id_fkey',
          'events_mnemonic_id_mnemonics_id_fkey'
        )
        order by conname
      `
        yield* Console.log(`[migrator] constraints ${label}: ${JSON.stringify(rows)}`)
      })
      yield* constraintSnapshot("before pushSchema")
      const _ = yield* make({ relations })
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
                  Effect.tap(() =>
                    Console.log(`[migrator] query ok (${Date.now() - queryStart}ms): ${summarizeQuery(query)}`),
                  ),
                  Effect.tapError((error) =>
                    Console.error(
                      `[migrator] query error (${Date.now() - queryStart}ms): ${summarizeQuery(query)}`,
                      error,
                    ),
                  ),
                  Effect.map((rows) => ({ rows })),
                ),
            )
          },
        } as never),
      ).pipe(
        Effect.tapError((error) => Console.error("[migrator] pushSchema failed", error)),
        Effect.timeout("30 seconds"),
      )
      yield* Console.log(`[migrator] pushSchema done (${Date.now() - pushStart}ms)`)
      yield* Console.log(`[migrator] pushSchema result: ${JSON.stringify(summarizePushResult(pushResult), null, 2)}`)
      if (pushResult.hints.length > 0) {
        yield* Console.log(`[migrator] pushSchema hints: ${JSON.stringify(pushResult.hints, null, 2)}`)
      }
      const applyStart = Date.now()
      yield* Console.log("[migrator] apply start")
      const applyResult = yield* Effect.tryPromise(() => pushResult.apply()).pipe(
        Effect.tapError((error) => Console.error("[migrator] apply failed", error)),
        Effect.timeout("30 seconds"),
      )
      yield* Console.log(`[migrator] apply done (${Date.now() - applyStart}ms)`)
      yield* Console.log(`[migrator] apply result: ${JSON.stringify(applyResult)}`)
      yield* constraintSnapshot("after apply")
      yield* Console.log("[migrator] done")
    }).pipe(
      Effect.tapCause(logCause),
      Effect.provide([DefaultServices, PgClient.layer(makePgConfig(process.env.CHX_DATABASE_URL)), NodeServices.layer]),
    ),
  )
}
