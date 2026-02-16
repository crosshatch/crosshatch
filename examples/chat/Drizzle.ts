import { latest as latest_, PgliteClient } from "@crosshatch/store"
import type { AnyPgAsyncRelationalQuery, AnyPgAsyncSelect } from "drizzle-orm/pg-core"
import { drizzle } from "drizzle-orm/pglite"
import { Effect, Stream } from "effect"
import { relations } from "./relations.ts"
import * as schema from "./schema.ts"
import { ContextKeys } from "./ContextKeys.ts"

export class Drizzle extends Effect.Service<Drizzle>()(ContextKeys.Drizzle, {
  scoped: Effect.gen(function* () {
    const pg = yield* PgliteClient.PgliteClient
    return drizzle({
      client: pg as never,
      relations,
      schema,
    })
  }),
}) {}

type Preparable = AnyPgAsyncRelationalQuery | AnyPgAsyncSelect

export const latest = <T extends Partial<Preparable> & Pick<Preparable, "prepare" | "_">>(
  f: (_: Drizzle) => T,
): Stream.Stream<T["_"]["result"]> =>
  Effect.gen(function* () {
    const _ = yield* Drizzle
    const built = f(_)
    const prepared = built.prepare("")
    return latest_(built.toSQL!()).pipe(Stream.map((rows) => prepared.mapResult(rows)))
  }).pipe(Stream.unwrap) as never
