import { FileSystem, Path } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { Array, Effect, Encoding, flow, Option, pipe, String } from "effect"
import { cwd } from "node:process"
import type { Plugin } from "vite"
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
  const resolved = new URL(import.meta.resolve("./migrations.d.ts", import.meta.url)).pathname

  const VIRTUAL_ID = "virtual:@crosshatch/store/migrations"

  const contents: Array<typeof Migration.Type> = []

  return {
    name: "@crosshatch/local",
    buildStart: () =>
      Effect.gen(function*() {
        contents.length = 0

        const fs = yield* FileSystem.FileSystem
        const { join } = yield* Path.Path

        const migrationsDir = join(cwd(), "migrations")
        const entries = yield* fs.readDirectory(migrationsDir).pipe(
          Effect.map(flow(
            Array.filterMap((name) =>
              name === "meta" ? Option.none() : Option.some({
                name,
                path: join(migrationsDir, name, "migration.sql"),
              })
            ),
          )),
        )

        entries.sort((a, b) => a.name.localeCompare(b.name))

        for (let idx = 0; idx < entries.length; idx++) {
          const { name, path } = entries[idx]!

          const content = yield* fs
            .readFileString(path)
            .pipe(Effect.map(flow(String.replace(/\r\n/g, "\n"), String.trim)))

          const when = whenFromFolderName(name)

          const hash = yield* Effect.tryPromise(() =>
            crypto.subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(content))
          ).pipe(
            Effect.map((v) => Encoding.encodeHex(new Uint8Array(v))),
          )

          const sql = pipe(
            content,
            String.replace(/\n\t?/g, ""),
            String.split("--> statement-breakpoint"),
            Array.map(String.trim),
            Array.filter((v) => v.length > 0),
          )

          contents.push({ idx, when, tag: name, hash, sql })
        }
      }).pipe(
        Effect.provide(NodeContext.layer),
        Effect.runPromise,
      ),

    resolveId(source) {
      if (source === VIRTUAL_ID) {
        return `\0${VIRTUAL_ID}`
      }
      return null
    },

    load(id) {
      if (id !== resolved) {
        return null
      }
      return `export const migrations = ${JSON.stringify(contents, null, 2)}`
    },
  }
}
