import type { NotNull } from "drizzle-orm"
import { type PgColumnBuilderBase, type PgEnum, pgEnum, type PgEnumColumnBuilderInitial } from "drizzle-orm/pg-core"
import { absurd, Schema as S } from "effect"
import { ColumnsCommon, type ColumnsConfig, extendBase } from "./schema_table_common.ts"

type SupersetKey<U extends { _tag: string }> = Exclude<
  { [K in U["_tag"]]: keyof Extract<U, { _tag: K }> }[U["_tag"]],
  "_tag" | "id" | "added" | "updated"
>

type Superset<U extends { _tag: string }> = {
  [K in SupersetKey<U>]: {
    [K2 in U["_tag"]]: Extract<U, { _tag: K2 }> extends Record<K, infer V> ? V : never
  }[U["_tag"]]
}

export interface TaggedUnionTable<
  B extends symbol,
  A extends { _tag: string },
  I,
  R,
> extends S.Schema<A, I, R> {
  columns: <C extends ColumnsConfig<Superset<A>>>(
    columns: C,
  ) => C & ColumnsCommon<B> & {
    _tag: NotNull<PgEnumColumnBuilderInitial<"_tag", [A["_tag"]]>>
  }
}

export const makeTagEnum = <
  K extends string,
  A extends { _tag: string },
  I,
  R,
>(key: K, schema: S.Schema<A, I, R>): PgEnum<[A["_tag"]]> => {
  const { ast } = S.encodedBoundSchema(schema)
  if (ast._tag !== "Union") {
    return absurd<never>(null!)
  }
  const { types } = ast
  const values = types.map((type) => {
    if (type._tag !== "TypeLiteral") {
      return absurd<never>(null!)
    }
    const { propertySignatures } = type
    const { type: signatureType } = propertySignatures.find(({ name }) => name === "_tag") ?? absurd<never>(null!)
    if (signatureType._tag !== "Literal") {
      return absurd<never>(null!)
    }
    return signatureType.literal
  })
  return pgEnum(key, values as never) as never
}

export const make = <
  B extends symbol,
  K extends string,
  A extends { _tag: string },
  I,
  R,
>(
  id: S.brand<typeof S.UUID, B>,
  tagKey: K,
  schema: S.Schema<A, I, R>,
): {
  tag: PgEnum<[A["_tag"]]>
  schema: TaggedUnionTable<B, A, I, R>
} => {
  const tag = makeTagEnum(tagKey, schema)
  const base = extendBase(id)(schema)
  return {
    tag,
    schema: {
      ...base,
      columns: (columns: Record<string, PgColumnBuilderBase>) => ({
        _tag: tag("_tag").notNull(),
        ...ColumnsCommon(id),
        ...columns,
      }),
    } as never,
  }
}
