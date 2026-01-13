import {
  integer,
  numeric,
  type PgColumnBuilderBase,
  type ReferenceConfig,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { Brand, Schema as S } from "effect"
import { bytea } from "./custom_types.ts"

export const ref = <K extends string, F extends ReferenceConfig["ref"]>(
  id: K,
  f: F,
  a?: ReferenceConfig["actions"] | undefined,
) => uuid(id).$type<ReturnType<F>["_"]["data"]>().references(f, a)

export const id = <T>() => uuid("id").primaryKey().notNull().defaultRandom().$type<T>()

export const lastUsed = timestamp("last_used", {
  mode: "date",
  withTimezone: true,
}).notNull().defaultNow()

export const amount = numeric("amount", {
  precision: 36,
  scale: 18,
  mode: "string",
}).notNull()

export const added = timestamp("added", {
  mode: "date",
  withTimezone: true,
}).notNull().defaultNow()

export const updated = timestamp("updated", {
  mode: "date",
  withTimezone: true,
}).notNull().defaultNow().$onUpdateFn(() => new Date())

export const label = text("label").notNull()

export const ordinal = integer("ordinal").generatedByDefaultAsIdentity().notNull()

export const envelopeCommon = {
  cv: bytea("cv").notNull(),
  iv: bytea("iv").notNull(),
}

export type Columns<T> = {
  [K in Exclude<keyof T, "id" | "added" | "updated">]: PgColumnBuilderBase & {
    _: { data: T[K] } | { $type: T[K] }
  }
}

export const columns = <
  B extends symbol,
  T extends { id: string & Brand.Brand<B> },
  F extends Columns<T>,
>(_schema: S.Schema<T, any>, fields: F) => ({
  id: id<T["id"]>(),
  added,
  updated,
  ...fields,
})
