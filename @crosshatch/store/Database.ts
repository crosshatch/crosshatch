import { prefix } from "@crosshatch/util"
import { live, type PGliteWithLive } from "@electric-sql/pglite/live"
import { PGliteWorker } from "@electric-sql/pglite/worker"
import { drizzle } from "drizzle-orm/pglite"
import { Context, Effect, Layer } from "effect"

export class DatabaseWorker extends Context.Tag(prefix("store/DatabaseWorker"))<
  DatabaseWorker,
  new(options?: { name?: string }) => Worker
>() {}

export class Database extends Context.Tag(prefix("store/Database"))<Database, PGliteWithLive>() {
  static layer = Layer.scoped(
    Database,
    Effect.gen(function*() {
      const client = new PGliteWorker(new (yield* DatabaseWorker)(), { extensions: { live } })
      yield* Effect.addFinalizer(() => Effect.promise(() => client.close()))
      yield* Effect.tryPromise(() => client.waitReady)
      return client as never as PGliteWithLive
    }),
  )
}

export class Drizzle extends Context.Tag(prefix("store/Drizzle"))<
  Drizzle,
  ReturnType<typeof drizzle<Record<string, unknown>>>
>() {}
