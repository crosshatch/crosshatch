import type { AnyPgColumnBuilder } from "drizzle-orm/pg-core"
import { Schema as S } from "effect"
import { Base, type BaseEncoded, type BaseType, ColumnsCommon, type ColumnsConfig } from "./schema_table_common.ts"

export interface StructTable<B extends symbol, A, I, R> extends S.Schema<A & BaseType<B>, I & BaseEncoded, R> {
  columns: <C extends ColumnsConfig<A>>(columns: C) => C & ColumnsCommon<B>
}

export const make = <B extends symbol, A, I, R>(
  id: S.brand<typeof S.UUID, B>,
  schema: S.Schema<A, I, R>,
): StructTable<B, A, I, R> =>
  Object.assign(Base(id).pipe(S.extend(schema)), {
    columns: (columns: Record<string, AnyPgColumnBuilder>) => ({
      ...ColumnsCommon(id),
      ...columns,
    }),
  }) as never
