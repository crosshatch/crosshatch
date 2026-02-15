import type { PGlite } from "@electric-sql/pglite"
import { Effect } from "effect"
import { Migration } from "./Migration.ts"

const MIGRATIONS = "_migrations"

export const migrate = Effect.fn(function* ({
  client: _,
  migrations,
  enable,
}: {
  client: PGlite
  migrations: Array<typeof Migration.Type>
  enable: Array<string>
}) {
  yield* Effect.tryPromise(() =>
    _.exec(`
      CREATE TABLE IF NOT EXISTS "${MIGRATIONS}" (
        id bigserial PRIMARY KEY NOT NULL,
        hash text NOT NULL,
        tag text NOT NULL,
        created_at bigint NOT NULL
      );
    `),
  )

  yield* Effect.tryPromise(() => _.exec(enable.map((v) => `CREATE EXTENSION IF NOT EXISTS "${v}";`).join(" ")))

  const {
    rows: [latest],
  } = yield* Effect.tryPromise(() =>
    _.query<{
      id: number
      hash: string
      tag: string
      created_at: number
    }>(`
      SELECT id, hash, created_at
      FROM "${MIGRATIONS}"
      ORDER BY created_at DESC
      LIMIT 1;
    `),
  )

  const pending = migrations.filter((migration) => {
    const timestamp = latest?.created_at ?? 0
    return !latest || Number(timestamp) < migration.when
  })

  if (!pending.length) return

  yield* Effect.gen(function* () {
    yield* Effect.tryPromise(() => _.exec("BEGIN"))
    for (const migration of pending) {
      const { hash, when, tag } = migration
      for (const statement of migration.sql) {
        yield* Effect.tryPromise(() => _.exec(statement))
        yield* Effect.tryPromise(() =>
          _.query(
            `
              INSERT INTO "${MIGRATIONS}" ("hash", "created_at", "tag")
              VALUES ($1, $2, $3);
            `,
            [hash, when, tag],
          ),
        )
      }
    }
    yield* Effect.tryPromise(() => _.exec("COMMIT"))
  }).pipe(Effect.tapErrorTag("UnknownException", () => Effect.tryPromise(() => _.exec("ROLLBACK"))))
})
