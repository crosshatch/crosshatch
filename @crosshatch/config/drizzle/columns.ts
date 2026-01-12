import { u8a } from "@crosshatch/util"
import { Prompt } from "@effect/ai"
import {
  customType,
  ExtraConfigColumn,
  IndexBuilder,
  integer,
  numeric,
  type PgColumnBuilderBase,
  type ReferenceConfig,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { Brand, identity, Schema as S } from "effect"

export type Columns<S extends S.Schema.Any> = {
  [K in Exclude<keyof S["Type"], "id">]: PgColumnBuilderBase & {
    _: { data: S["Type"][K] } | { $type: S["Type"][K] }
  }
}

export const uniqueIndices =
  <const I extends ReadonlyArray<ReadonlyArray<string>>>(prefix: string, indices: I) =>
  <T extends Record<I[number][number], ExtraConfigColumn>>(_: T): Array<IndexBuilder> =>
    indices.map((keys_) => {
      const keys = keys_.toSorted()
      return uniqueIndex([prefix, ...keys].join("_")).on(
        ...keys.map((key) => _[key as I[number][number]]) as never as [ExtraConfigColumn],
      )
    })

export const ref = <K extends string, F extends ReferenceConfig["ref"]>(
  id: K,
  f: F,
  a?: ReferenceConfig["actions"] | undefined,
) => uuid(id).$type<ReturnType<F>["_"]["data"]>().references(f, a)

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

export const envelopeCommon = {
  cv: bytea("cv").notNull(),
  iv: bytea("iv").notNull(),
}

export const columns = <S_ extends S.Schema.Any, B extends symbol>(_id: S.brand<S_, B>) => ({
  id: uuid("id").primaryKey().notNull().defaultRandom().$type<string & Brand.Brand<B>>(),
  added,
  updated,
})
