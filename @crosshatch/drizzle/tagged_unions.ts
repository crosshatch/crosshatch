import { type PgEnum, pgEnum } from "drizzle-orm/pg-core"
import { absurd, Schema as S, Types } from "effect"

import { type ColumnsConfig, columnsCommon } from "./_common.ts"

type SupersetKey<U extends { _tag: string }> = Exclude<
  { [K in Types.Tags<U>]: keyof Types.ExtractTag<U, K> }[Types.Tags<U>],
  "_tag"
>
type Superset<U extends { _tag: string }> = {
  [K in SupersetKey<U>]: {
    [K2 in Types.Tags<U>]: Types.ExtractTag<U, K2> extends Record<K, infer V> ? V : never
  }[Types.Tags<U>]
}

export const tagEnum = <K extends string, A extends { _tag: string }, I, R>(
  key: K,
  schema: S.Schema<A, I, R>,
): PgEnum<[A["_tag"]]> => {
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

export const taggedUnionColumns = <
  A extends {
    readonly id: string
    readonly _tag: string
  },
  I,
  R,
  C extends ColumnsConfig<Superset<A>>,
>(
  _schema: S.Schema<A, I, R>,
  tagEnum: PgEnum<[A["_tag"]]>,
  columns: C,
) => ({
  _tag: tagEnum("_tag").notNull(),
  ...columnsCommon<A>(),
  ...columns,
})
