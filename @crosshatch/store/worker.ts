import { layerLogger } from "@crosshatch/util/layerLogger"
import { BrowserSocket } from "@effect/platform-browser"
import { PGlite } from "@electric-sql/pglite"
import { fuzzystrmatch } from "@electric-sql/pglite/contrib/fuzzystrmatch"
import { lo } from "@electric-sql/pglite/contrib/lo"
import { uuid_ossp } from "@electric-sql/pglite/contrib/uuid_ossp"
import { vector } from "@electric-sql/pglite/vector"
import { worker as worker_ } from "@electric-sql/pglite/worker"
import { Effect } from "effect"
import { migrate } from "./migrate.ts"
import type { Migration } from "./Migration.ts"

export const worker = (
  key: string,
  migrations: Array<typeof Migration.Type>,
  dev?: boolean | undefined,
) =>
  worker_({
    init: () =>
      Effect.gen(function*() {
        const client = yield* Effect.tryPromise(() =>
          PGlite.create({
            extensions: { uuid_ossp, fuzzystrmatch, lo, vector },
            dataDir: `idb://${key}`,
            relaxedDurability: true,
          })
        )
        yield* migrate({
          client,
          migrations,
          enable: ["uuid-ossp", "vector", "fuzzystrmatch", "lo"],
        })
        yield* Effect.log(`${key} worker initialized`)
        return client
      }).pipe(
        Effect.provide([
          layerLogger(dev ?? false),
          BrowserSocket.layerWebSocketConstructor,
        ]),
        Effect.scoped,
        Effect.runPromise,
      ),
  })
