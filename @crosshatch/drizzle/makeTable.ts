import {
  type AnyPgColumnBuilder,
  type PgBuildColumns,
  type PgBuildExtraConfigColumns,
  pgTable,
  type PgTableExtraConfigValue,
  type PgTableWithColumns,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { Brand, Schema as S } from "effect"

const base = <B extends symbol>(_id: S.brand<typeof S.UUID, B>) => ({
  id: uuid("id").primaryKey().notNull().defaultRandom().$type<string & Brand.Brand<B>>(),
  added: timestamp("added", {
    mode: "date",
    withTimezone: true,
  }).notNull().defaultNow(),
  updated: timestamp("updated", {
    mode: "date",
    withTimezone: true,
  }).notNull().defaultNow().$onUpdateFn(() => new Date()),
})

export const makeTable = <
  TTableName extends string,
  B extends symbol,
  TColumnsMap extends Record<string, AnyPgColumnBuilder>,
>(
  name: TTableName,
  id: S.brand<typeof S.UUID, B>,
  columns: TColumnsMap,
  extraConfig?: (self: PgBuildExtraConfigColumns<TColumnsMap>) => PgTableExtraConfigValue[],
): PgTableWithColumns<{
  name: TTableName
  schema: undefined
  columns: PgBuildColumns<TTableName, TColumnsMap & ReturnType<typeof base<B>>>
  dialect: "pg"
}> =>
  pgTable(
    name,
    {
      ...base(id),
      ...columns,
    },
    extraConfig,
  ) as never
