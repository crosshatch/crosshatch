import { prefix } from "@crosshatch/util"
import { live, type LiveNamespace } from "@electric-sql/pglite/live"
import { PGliteWorker } from "@electric-sql/pglite/worker"
import { Context, Effect, Layer } from "effect"

export class PgliteClient extends Context.Tag(prefix("store/PgliteClient"))<
  PgliteClient,
  PGliteWorker & {
    live: LiveNamespace
  }
>() {}

export const layer = (worker: new(options?: { name?: string }) => Worker) =>
  Layer.scoped(
    PgliteClient,
    Effect.gen(function*() {
      const client = yield* Effect.tryPromise(
        () => PGliteWorker.create(new worker(), { extensions: { live } }),
      )
      yield* Effect.addFinalizer(() => Effect.promise(() => client.close()))
      yield* Effect.tryPromise(() => client.waitReady)
      return client
    }),
  )
