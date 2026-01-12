import { FileSystem, Path } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { Array, Effect, Encoding, flow, pipe, Schema as S, String } from "effect"
import { cwd } from "node:process"
import type { Plugin } from "vite"
import type { Migration } from "./Migration.ts"

const Journal = S.Struct({
  entries: S.Array(
    S.Struct({
      idx: S.Number,
      version: S.NumberFromString,
      when: S.Number,
      tag: S.String,
      breakpoints: S.Boolean,
    }),
  ),
})

export default (): Plugin => {
  const resolved = new URL(import.meta.resolve("./migrations.d.ts", import.meta.url)).pathname

  const VIRTUAL_ID = "virtual:@crosshatch/store/migrations"

  const contents: Array<typeof Migration["Type"]> = []

  return {
    name: "@crosshatch/local",
    buildStart: () =>
      Effect.gen(function*() {
        contents.length = 0

        const fs = yield* FileSystem.FileSystem
        const { join } = yield* Path.Path

        const journal = yield* fs.readFileString(
          join(cwd(), "migrations/meta/_journal.json"),
        ).pipe(
          Effect.map((v) => JSON.parse(v)),
          Effect.flatMap(S.decodeUnknown(Journal)),
        )

        for (let index = 0; index < journal.entries.length; index++) {
          const { when, idx, tag } = journal.entries[index]!

          const content = yield* fs
            .readFileString(join(cwd(), `migrations/${tag}.sql`))
            .pipe(Effect.map(flow(String.replace(/\r\n/g, "\n"), String.trim)))

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

          contents.push({ idx, when, tag, hash, sql })
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
