import { PgliteClient } from "@crosshatch/effect-pglite"
import type { AnyRelations, Query } from "drizzle-orm"
import type { EffectPgDatabase } from "drizzle-orm/effect-postgres"
import { PgEffectRelationalQuery } from "drizzle-orm/pg-core/effect"
import { Effect, Record, Stream } from "effect"

// TODO: use actual drizzle type
export interface LiveQueryInput {
  toSQL(): Query
  _: { selectedFields: any }
  prepare?: (name: string) => any
}

export const liveQuery = <S extends Record<string, unknown>, Rel extends AnyRelations, E, R>(
  Tag: Effect.Effect<EffectPgDatabase<S, Rel>, E, R>,
) =>
<A extends LiveQueryInput>(
  build: (_: EffectPgDatabase<S, Rel>) => A,
): Stream.Stream<
  A extends Effect.Effect<infer A, any, any> ? A : never,
  PgliteClient.LiveQueryError | E,
  PgliteClient.LiveQuery | R
> => {
  return Effect.gen(function*() {
    const _ = yield* Tag
    const built = build(_)
    const f: (rows_: Array<{ [key: string]: unknown }>) => any = built instanceof PgEffectRelationalQuery
      ? (() => {
        const prepared = built.prepare("")
        return (rows) => prepared.mapResult(rows)
      })()
      : (rows) =>
        rows.map((row) =>
          Record.map(
            built._.selectedFields,
            (col: {
              name: string
              mapFromDriverValue: (value: unknown) => unknown
            }) => col.mapFromDriverValue(row[col.name]),
          )
        )
    return PgliteClient
      .liveQuery(built.toSQL())
      .pipe(Stream.map(f))
  }).pipe(
    Stream.unwrap,
  )
}
