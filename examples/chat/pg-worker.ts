import { PGlite } from "@electric-sql/pglite"
import { fuzzystrmatch } from "@electric-sql/pglite/contrib/fuzzystrmatch"
import { lo } from "@electric-sql/pglite/contrib/lo"
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp"
import { vector } from "@electric-sql/pglite/vector"
import { worker as worker_ } from "@electric-sql/pglite/worker"
import { Effect } from "effect"
import "@crosshatch/ui/prelude"
import migrations from "@/migrations"

const MIGRATIONS = "_migrations"

worker_({
  init: () =>
    Effect.gen(function* () {
      const client = yield* Effect.tryPromise(() =>
        PGlite.create({
          dataDir: `idb://crosshatch.chat`,
          extensions: { fuzzystrmatch, lo, uuid_ossp, vector },
          relaxedDurability: true,
        }),
      )

      yield* Effect.tryPromise(() =>
        client.exec(`
          CREATE TABLE IF NOT EXISTS "${MIGRATIONS}" (
            id bigserial PRIMARY KEY NOT NULL,
            hash text NOT NULL,
            tag text NOT NULL,
            created_at bigint NOT NULL
          );
        `),
      )

      yield* Effect.tryPromise(() =>
        client.exec(
          ["uuid-ossp", "vector", "fuzzystrmatch", "lo"].map((v) => `CREATE EXTENSION IF NOT EXISTS "${v}";`).join(" "),
        ),
      )

      const {
        rows: [latest],
      } = yield* Effect.tryPromise(() =>
        client.query<{
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

      if (!pending.length) return client

      yield* Effect.gen(function* () {
        yield* Effect.tryPromise(() => client.exec("BEGIN"))
        for (const migration of pending) {
          const { hash, when, tag } = migration
          for (const statement of migration.sql) {
            yield* Effect.tryPromise(() => client.exec(statement))
            yield* Effect.tryPromise(() =>
              client.query(
                `
                  INSERT INTO "${MIGRATIONS}" ("hash", "created_at", "tag")
                  VALUES ($1, $2, $3);
                `,
                [hash, when, tag],
              ),
            )
          }
        }
        yield* Effect.tryPromise(() => client.exec("COMMIT"))
      }).pipe(Effect.tapErrorTag("UnknownException", () => Effect.tryPromise(() => client.exec("ROLLBACK"))))

      return client
    }).pipe(Effect.runPromise),
})
