import { type $Type } from "drizzle-orm"
import {
  type PgEnum,
  pgEnum,
  type PgEnumColumnBuilderInitial,
  type PgTextBuilderInitial,
  type PgUUIDBuilderInitial,
} from "drizzle-orm/pg-core"
import { absurd, Schema as S } from "effect"

type SupersetKey<U extends { _tag: string }> = Exclude<
  { [K in U["_tag"]]: keyof Extract<U, { _tag: K }> }[U["_tag"]],
  "_tag"
>

type Superset<U extends { _tag: string }> = {
  [K in SupersetKey<U>]: {
    [K2 in U["_tag"]]: Extract<U, { _tag: K2 }> extends Record<K, infer V> ? V : never
  }[U["_tag"]]
}

type Columns<T> = { [K in keyof T]: { _: { data: T[K] } | { $type: T[K] } } }

type RefColumns<V, W> = {
  [K in Exclude<keyof V, keyof W> as `${Extract<K, string>}Id`]: $Type<
    PgUUIDBuilderInitial<string> | PgTextBuilderInitial<string, [string, ...Array<string>]>,
    any
  >
}

export const taggedUnion = <
  K extends string,
  A extends { _tag: string },
  E,
  R,
  T extends Superset<A>,
  F extends Partial<Columns<T>>,
  R2 extends RefColumns<T, F>,
>(
  key: K,
  schema: S.Schema<A, E, R>,
  supersetColumns: F,
  supersetReferences: R2,
): {
  tag: PgEnum<[A["_tag"]]>
  superset:
    & { _tag: PgEnumColumnBuilderInitial<"_tag", Extract<[A["_tag"]], [string, ...Array<string>]>> }
    & F
    & R2
} => {
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
  const tag = pgEnum(key, values as never)
  return {
    tag,
    superset: {
      _tag: tag(`${key}_tag`),
      ...supersetColumns,
      ...supersetReferences,
    },
  } as never
}
