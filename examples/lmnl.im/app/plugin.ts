import type { Plugin } from "vite"

import { NodeServices } from "@effect/platform-node"
import { FileSystem, Path, Array as EArray, Effect, Encoding, flow, pipe, String as EString, Result } from "effect"
import { cwd } from "node:process"

import type { Migration } from "./Migration.ts"

const formatToMillis = (dateStr: string): number => {
  const year = parseInt(dateStr.slice(0, 4), 10)
  const month = parseInt(dateStr.slice(4, 6), 10) - 1
  const day = parseInt(dateStr.slice(6, 8), 10)
  const hour = parseInt(dateStr.slice(8, 10), 10)
  const minute = parseInt(dateStr.slice(10, 12), 10)
  const second = parseInt(dateStr.slice(12, 14), 10)

  return Date.UTC(year, month, day, hour, minute, second)
}

const whenFromFolderName = (name: string): number => {
  const prefix = name.slice(0, 14)
  return /^\d{14}$/.test(prefix) ? formatToMillis(prefix) : 0
}

export default (): Plugin => {
  const ALIAS_ID = "@/migrations"
  const VIRTUAL_ID = "virtual:chat-migrations"
  const RESOLVED_ID = `\0${VIRTUAL_ID}`

  const contents: Array<typeof Migration.Type> = []

  return {
    buildStart: () =>
      Effect.gen(function* () {
        contents.length = 0

        const fs = yield* FileSystem.FileSystem
        const { join } = yield* Path.Path

        const migrationsDir = join(cwd(), "migrations")
        const entries = yield* fs.readDirectory(migrationsDir).pipe(
          Effect.map(
            flow(
              EArray.filterMap((name) =>
                name === "meta"
                  ? Result.failVoid
                  : Result.succeed({
                      name,
                      path: join(migrationsDir, name, "migration.sql"),
                    }),
              ),
            ),
          ),
        )

        entries.sort((a, b) => a.name.localeCompare(b.name))

        for (let idx = 0; idx < entries.length; idx++) {
          const { name, path } = entries[idx]!

          const content = yield* fs
            .readFileString(path)
            .pipe(Effect.map(flow(EString.replace(/\r\n/g, "\n"), EString.trim)))

          const when = whenFromFolderName(name)

          const hash = yield* Effect.tryPromise(() =>
            crypto.subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(content)),
          ).pipe(Effect.map((v) => Encoding.encodeHex(new Uint8Array(v))))

          const sql = pipe(
            content,
            EString.replace(/\n\t?/g, ""),
            EString.split("--> statement-breakpoint"),
            EArray.map(EString.trim),
            EArray.filter((v) => v.length > 0),
          )

          contents.push({ hash, idx, sql, tag: name, when })
        }
      }).pipe(Effect.provide(NodeServices.layer), Effect.runPromise),
    load(id) {
      if (id !== RESOLVED_ID) {
        return null
      }
      return `const migrations = ${JSON.stringify(contents, null, 2)}\nexport { migrations }\nexport default migrations`
    },

    name: "@crosshatch/chat-migrations",

    resolveId(source) {
      if (source === ALIAS_ID || source === VIRTUAL_ID) {
        return RESOLVED_ID
      }
      return null
    },
  }
}
