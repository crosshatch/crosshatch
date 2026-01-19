import { prefix } from "@crosshatch/util"
import { PgClient } from "@effect/sql-pg"
import { drizzle } from "drizzle-orm/effect-postgres"
import { Effect } from "effect"
import { relations } from "./relations"
import * as schema from "./schema"

export class Drizzle extends Effect.Service<Drizzle>()(prefix("chat/Drizzle"), {
  scoped: Effect.gen(function*() {
    const pg = yield* PgClient.PgClient
    const _ = drizzle(pg, {
      schema,
      relations,
      logger: true,
    })
    return _
  }),
}) {}
