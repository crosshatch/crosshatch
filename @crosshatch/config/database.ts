import { Prompt } from "@effect/ai"
import {
  customType,
  index as index_,
  integer,
  numeric,
  pgTable,
  type ReferenceConfig,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core"
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

export const used = timestamp("used", {
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
  fromDriver: (v) => v.slice(),
})

export const Embeddings = <K extends string, F extends ReferenceConfig["ref"]>(key: K, f: F) =>
  pgTable(key, {
    id,
    embedding: vector("embedding", { dimensions: 384 }),
    sourceId: ref("source", f, { onDelete: "cascade" }).notNull(),
  }, (_) => [
    index_(`${key}_embeddings`).using("hnsw", _.embedding.op("vector_cosine_ops")),
  ])
