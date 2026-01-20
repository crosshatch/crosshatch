import { latest as latest_, PgliteClient } from "@crosshatch/store"
import { prefix } from "@crosshatch/util"
import type { AnyPgAsyncRelationalQuery, AnyPgAsyncSelect } from "drizzle-orm/pg-core"
import { drizzle } from "drizzle-orm/pglite"
import { Effect, Stream } from "effect"
import { relations } from "./relations"
import * as schema from "./schema"

export class Drizzle extends Effect.Service<Drizzle>()(prefix("chat/Drizzle"), {
  scoped: Effect.gen(function*() {
    const pg = yield* PgliteClient.PgliteClient
    return drizzle({
      schema,
      relations,
      client: pg as never,
    })
  }),
}) {}

type Preparable = AnyPgAsyncRelationalQuery | AnyPgAsyncSelect

export const latest = <
  T extends Partial<Preparable> & Pick<Preparable, "prepare" | "_">,
>(f: (_: Drizzle) => T): Stream.Stream<T["_"]["result"]> =>
  Effect.gen(function*() {
    const _ = yield* Drizzle
    const built = f(_)
    const prepared = built.prepare("")
    return latest_(built.toSQL!()).pipe(
      Stream.map((rows) => prepared.mapResult(rows)),
    )
  }).pipe(
    Stream.unwrap,
  ) as never
