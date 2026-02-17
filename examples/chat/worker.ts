import { BrowserSocket } from "@effect/platform-browser"
import { PGlite } from "@electric-sql/pglite"
import { fuzzystrmatch } from "@electric-sql/pglite/contrib/fuzzystrmatch"
import { lo } from "@electric-sql/pglite/contrib/lo"
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp"
import { vector } from "@electric-sql/pglite/vector"
import { worker as worker_ } from "@electric-sql/pglite/worker"
import { Effect } from "effect"

import migrations from "@/migrations"

import { migrate } from "./migrate.ts"

import "@crosshatch/ui/prelude"
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
      yield* migrate({
        client,
        enable: ["uuid-ossp", "vector", "fuzzystrmatch", "lo"],
        migrations,
      })
      return client
    }).pipe(Effect.provide(BrowserSocket.layerWebSocketConstructor), Effect.scoped, Effect.runPromise),
})
