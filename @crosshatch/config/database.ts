import { u8a } from "@crosshatch/util"
import { Prompt } from "@effect/ai"
import type { $Type } from "drizzle-orm"
import {
  customType,
  ExtraConfigColumn,
  index as index_,
  IndexBuilder,
  integer,
  numeric,
  type PgColumnBuilderBase,
  type PgEnum,
  pgEnum,
  type PgEnumColumnBuilderInitial,
  pgTable,
  type PgTextBuilderInitial,
  type PgUUIDBuilderInitial,
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

export const uuid = uuid_("id").primaryKey().notNull().defaultRandom()
export const textId = text("id").primaryKey().notNull()

export const ref = <K extends string, F extends ReferenceConfig["ref"]>(
  id: K,
  f: F,
  a?: ReferenceConfig["actions"] | undefined,
  // TODO: should this be narrowed for the case of uuid? Or does it not matter?
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
    id: uuid,
    embedding: vector("embedding", { dimensions: 384 }),
    sourceId: ref("source", f, { onDelete: "cascade" }).notNull(),
  }, (_) => [
    index_(`${key}_embeddings`).using("hnsw", _.embedding.op("vector_cosine_ops")),
  ])

export const cvsCommon = {
  cv: bytea("cv").notNull(),
  iv: bytea("iv").notNull(),
}

export const tag = <const S_ extends S.Union<ReadonlyArray<S.TaggedStruct<any, any>>>>(
  schema: S_,
): PgEnum<Extract<tagged.EnumKeys<S_["members"]>, [string, ...Array<string>]>> =>
  pgEnum(
    "_tag",
    schema.members.map(
      ({ fields: { _tag: { ast: { type: { literal } } } } }) => literal,
    ) as never,
  ) as never

export const tagged = <
  const S_ extends S.Union<ReadonlyArray<S.TaggedStruct<any, any>>>,
  T extends tagged.ColumnTypes<Extract<S_["Type"], { _tag: string }>>,
  C extends Partial<tagged.Columns<T>>,
  R extends tagged.RefColumns<T, C>,
>(
  _schema: S_,
  _tag: PgEnum<Extract<tagged.EnumKeys<S_["members"]>, [string, ...Array<string>]>>,
  members: C,
  memberRefs: R,
):
  & {
    _tag: PgEnumColumnBuilderInitial<
      "_tag",
      Extract<tagged.EnumKeys<S_["members"]>, [string, ...Array<string>]>
    >
  }
  & C
  & R =>
{
  return {
    _tag,
    ...members,
    ...memberRefs,
  } as never
}
export declare namespace tagged {
  export type MemberKey<U extends { _tag: string }> = Exclude<
    {
      [K in U["_tag"]]: keyof Extract<U, { _tag: K }>
    }[U["_tag"]],
    "_tag"
  >
  export type AnyTaggedStruct = S.TaggedStruct<any, any>
  export type EnumKeys<Tail extends ReadonlyArray<AnyTaggedStruct>> = Tail extends
    readonly [infer E0 extends AnyTaggedStruct, ...infer ERest extends ReadonlyArray<AnyTaggedStruct>]
    ? [E0["fields"]["_tag"] extends S.tag<infer K> ? K : never, ...EnumKeys<ERest>]
    : []
  export type ColumnTypes<U extends { _tag: string }> = {
    [K in tagged.MemberKey<U>]: {
      [K2 in U["_tag"]]: Extract<U, { _tag: K2 }> extends Record<K, infer V> ? V
        : never
    }[U["_tag"]]
  }
  export type Columns<T> = {
    [K in keyof T]: PgColumnBuilderBase & {
      _: { data: T[K] } | { $type: T[K] }
    }
  }
  export type RefColumns<V, W> = {
    [K in Exclude<keyof V, keyof W> as `${Extract<K, string>}Id`]: $Type<
      PgUUIDBuilderInitial<string> | PgTextBuilderInitial<string, [string, ...Array<string>]>,
      any
    >
  }
}
