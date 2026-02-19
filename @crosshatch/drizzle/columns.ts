import { integer, numeric, type ReferenceConfig, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { bytea } from "./custom_types.ts"

export const ref = <K extends string, F extends ReferenceConfig["ref"]>(
  id: K,
  f: F,
  a?: ReferenceConfig["config"] | undefined,
) => uuid(id).$type<ReturnType<F>["_"]["data"]>().references(f, a)

export const lastUsed = timestamp("last_used", {
  mode: "date",
  withTimezone: true,
})
  .notNull()
  .defaultNow()

export const amount = numeric("amount", {
  mode: "string",
  precision: 36,
  scale: 18,
}).notNull()

export const added = timestamp("added", {
  mode: "date",
  withTimezone: true,
})
  .notNull()
  .defaultNow()

export const updated = timestamp("updated", {
  mode: "date",
  withTimezone: true,
})
  .notNull()
  .defaultNow()
  .$onUpdateFn(() => new Date())

export const label = text("label").notNull()

export const ordinal = integer("ordinal").generatedByDefaultAsIdentity().notNull()

export const envelopeCommon = {
  cv: bytea("cv").notNull(),
  iv: bytea("iv").notNull(),
}
