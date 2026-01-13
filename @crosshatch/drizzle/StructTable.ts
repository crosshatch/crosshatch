import type { PgColumnBuilderBase } from "drizzle-orm/pg-core"
import { Brand, Schema as S } from "effect"
import { ColumnsCommon, type ColumnsConfig, extendBase } from "./schema_table_common.ts"

export interface StructTable<B extends symbol, A, I, R> extends S.Schema<A, I, R> {
  columns: <C extends ColumnsConfig<A>>(columns: C) => C & ColumnsCommon<B>
}

export const make = <B extends symbol, A, I, R>(
  id: S.brand<typeof S.UUID, B>,
  schema: S.Schema<A, I, R>,
): StructTable<
  B,
  A & {
    id: string & Brand.Brand<B>
    added: Date
    updated: Date
  },
  I & {
    id: string
    added: string
    updated: string
  },
  R
> =>
  Object.assign(extendBase(id)(schema), {
    columns: (columns: Record<string, PgColumnBuilderBase>) => ({ ...ColumnsCommon(id), ...columns }),
  }) as never
