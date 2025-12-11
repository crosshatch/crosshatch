import { u8a } from "@crosshatch/util"
import { Prompt } from "@effect/ai"
import { customType, integer, numeric, type ReferenceConfig, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { identity, Schema as S } from "effect"

export const id = uuid("id").primaryKey().notNull().defaultRandom()

export const ref = <K extends string, F extends ReferenceConfig["ref"]>(
  id: K,
  f: F,
  a?: ReferenceConfig["actions"] | undefined,
) => uuid(id).references(f, a)

export const added = timestamp("added", {
  mode: "date",
  withTimezone: true,
}).notNull().defaultNow()

export const updated = timestamp("updated", {
  mode: "date",
  withTimezone: true,
}).notNull().defaultNow()

export const amount = numeric("amount", {
  precision: 36,
  scale: 18,
  mode: "string",
}).notNull()

export const index = integer("index").generatedAlwaysAsIdentity()

export const label = text("label").notNull()

export const message = customType<{
  data: Prompt.Message
  driverData: typeof Prompt.Message["Encoded"]
}>({
  dataType: () => "jsonb",
  toDriver: S.encodeSync(Prompt.Message),
  fromDriver: S.decodeSync(Prompt.Message),
})

export const bytea = customType<{
  data: Uint8Array<ArrayBuffer>
  driverData: Uint8Array<ArrayBuffer>
}>({
  dataType: () => "bytea",
  toDriver: identity,
  fromDriver: u8a.normalize,
})
