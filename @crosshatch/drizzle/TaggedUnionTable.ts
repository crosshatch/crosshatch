import { type AnyPgColumnBuilder, type PgEnum, pgEnum, PgEnumColumnBuilder, type SetNotNull } from "drizzle-orm/pg-core"
import { absurd, Effect, Schema as S, Types } from "effect"

import { Base, type BaseEncoded, type BaseType, ColumnsCommon, type ColumnsConfig } from "./schema_table_common.ts"

type SupersetKey<U extends { _tag: string }> = Exclude<
  { [K in Types.Tags<U>]: keyof Types.ExtractTag<U, K> }[Types.Tags<U>],
  "_tag"
>
type Superset<U extends { _tag: string }> = {
  [K in SupersetKey<U>]: {
    [K2 in Types.Tags<U>]: Types.ExtractTag<U, K2> extends Record<K, infer V> ? V : never
  }[Types.Tags<U>]
}

export interface TaggedUnionTable<B extends symbol, A extends { _tag: string }, I, R> extends S.Schema<
  A & BaseType<B>,
  I & BaseEncoded,
  R
> {
  readonly columns: <C extends ColumnsConfig<Superset<A>>>(
    columns: C,
  ) => C &
    ColumnsCommon<B> & {
      _tag: SetNotNull<PgEnumColumnBuilder<[A["_tag"]]>>
    }
  // TODO: move tag spec into optional second param
  readonly fromRow: <K extends Types.Tags<A> = Types.Tags<A>>(
    _tag?: K | undefined,
    // TODO: further-constrain row?
  ) => (row: unknown) => Effect.Effect<Types.ExtractTag<A, K> & BaseType<B>>
}

export const makeTagEnum = <K extends string, A extends { _tag: string }, I, R>(
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

export const make = <B extends symbol, A extends { _tag: string }, I, R>(
  id: S.brand<typeof S.UUID, B>,
  schema: S.Schema<A, I, R>,
): TaggedUnionTable<B, A, I, R> => {
  const base = Base(id).pipe(S.extend(schema))
  return Object.assign(base, {
    columns: (columns: Record<string, AnyPgColumnBuilder>) => ({
      ...ColumnsCommon(id),
      ...columns,
    }),
    fromRow:
      <K extends Types.Tags<A> = Types.Tags<A>>(_tag?: K | undefined) =>
      (row: unknown) =>
        S.encodeUnknown(base)(row).pipe(Effect.flatMap(S.decode(base))),
  }) as never
}
