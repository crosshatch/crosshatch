import { u8a } from "@crosshatch/util"
import { Prompt } from "@effect/ai"
import {
  customType,
  ExtraConfigColumn,
  index as index_,
  IndexBuilder,
  integer,
  numeric,
  pgTable,
  type ReferenceConfig,
  text,
  timestamp,
  uniqueIndex,
  uuid as uuid_,
  vector,
} from "drizzle-orm/pg-core"
import { identity, Schema as S } from "effect"

export const uniqueIndices =
  <const I extends ReadonlyArray<ReadonlyArray<string>>>(prefix: string, indices: I) =>
  <T extends Record<I[number][number], ExtraConfigColumn>>(_: T): Array<IndexBuilder> =>
    indices.map((keys_) => {
      const keys = keys_.toSorted()
      return uniqueIndex([prefix, ...keys].join("_")).on(
        ...keys.map((key) => _[key as I[number][number]]) as never as [ExtraConfigColumn],
      )
    })

export const uuid = <T extends string = string>() => uuid_("id").primaryKey().notNull().defaultRandom().$type<T>()
export const textId = <T extends string = string>() => text("id").primaryKey().notNull().$type<T>()

// TODO: combine?
export const uuidRef = <K extends string, F extends ReferenceConfig["ref"]>(
  id: K,
  f: F,
  a?: ReferenceConfig["actions"] | undefined,
) => uuid_(id).$type<ReturnType<F>["_"]["data"]>().references(f, a)
export const textRef = <K extends string, F extends ReferenceConfig["ref"]>(
  id: K,
  f: F,
  a?: ReferenceConfig["actions"] | undefined,
) => text(id).$type<ReturnType<F>["_"]["data"]>().references(f, a)

export const added = timestamp("added", {
  mode: "date",
  withTimezone: true,
}).notNull().defaultNow()

export const lastUsed = timestamp("last_used", {
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
  data: u8a
  driverData: u8a
}>({
  dataType: () => "bytea",
  toDriver: identity,
  fromDriver: identity,
})

export const Embeddings = <K extends string, F extends ReferenceConfig["ref"]>(key: K, f: F) =>
  pgTable(key, {
    id: uuid(),
    embedding: vector("embedding", { dimensions: 384 }),
    sourceId: uuidRef("source", f, { onDelete: "cascade" }).notNull(),
  }, (_) => [
    index_(`${key}_embeddings`).using("hnsw", _.embedding.op("vector_cosine_ops")),
  ])

export const cvsCommon = {
  cv: bytea("cv").notNull(),
  iv: bytea("iv").notNull(),
}
