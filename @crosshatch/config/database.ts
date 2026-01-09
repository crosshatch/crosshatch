import { u8a } from "@crosshatch/util"
import { Prompt } from "@effect/ai"
import type { NotNull } from "drizzle-orm"
import {
  customType,
  ExtraConfigColumn,
  index as index_,
  IndexBuilder,
  integer,
  numeric,
  type PgColumnBuilderBase,
  pgEnum,
  type PgEnumColumnBuilderInitial,
  pgTable,
  type ReferenceConfig,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core"
import { Brand, identity, Schema as S } from "effect"

export const uniqueIndices =
  <const I extends ReadonlyArray<ReadonlyArray<string>>>(prefix: string, indices: I) =>
  <T extends Record<I[number][number], ExtraConfigColumn>>(_: T): Array<IndexBuilder> =>
    indices.map((keys_) => {
      const keys = keys_.toSorted()
      return uniqueIndex([prefix, ...keys].join("_")).on(
        ...keys.map((key) => _[key as I[number][number]]) as never as [ExtraConfigColumn],
      )
    })

export const id = uuid("id").primaryKey().notNull().defaultRandom()

export const brandedId = <K extends symbol>(_branded: S.brand<typeof S.UUID, K>) => ({
  id: uuid("id").primaryKey().notNull().defaultRandom().$type<Brand.Branded<string, K>>(),
})

export const ref = <K extends string, F extends ReferenceConfig["ref"]>(
  id: K,
  f: F,
  a?: ReferenceConfig["actions"] | undefined,
) => uuid(id).$type<ReturnType<F>["_"]["data"]>().references(f, a)

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
    id,
    embedding: vector("embedding", { dimensions: 384 }),
    sourceId: ref("source", f, { onDelete: "cascade" }).notNull(),
  }, (_) => [
    index_(`${key}_embeddings`).using("hnsw", _.embedding.op("vector_cosine_ops")),
  ])

export const cvsCommon = {
  cv: bytea("cv").notNull(),
  iv: bytea("iv").notNull(),
}

export const taggedUnion = <
  const S_ extends S.Union<ReadonlyArray<S.TaggedStruct<any, any>>>,
  V extends taggedUnion.Columns<Extract<S_["Type"], { _tag: string }>>,
>(schema: S_, members: V): {
  _tag: NotNull<
    PgEnumColumnBuilderInitial<"_tag", Extract<taggedUnion.EnumKeys<S_["members"]>, [string, ...Array<string>]>>
  >
} & V => {
  const enumValues: ReadonlyArray<string> = schema.members.map(({ fields }) => {
    const { _tag } = fields
    return _tag.ast.type.literal
  })
  return {
    _tag: pgEnum("_tag", enumValues as never)("_tag").notNull(),
    ...members,
  } as never
}
export declare namespace taggedUnion {
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

  export type Columns<U extends { _tag: string }> = {
    [K in taggedUnion.MemberKey<U>]: {
      [K2 in U["_tag"]]: Extract<U, { _tag: K2 }> extends Record<K, infer V> ? PgColumnBuilderBase & {
          _: { data: V } | { $type: V }
        }
        : never
    }[U["_tag"]]
  }
}
