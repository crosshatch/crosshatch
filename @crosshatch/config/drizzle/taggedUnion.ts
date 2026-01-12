import type { NotNull } from "drizzle-orm"
import { type PgColumnBuilderBase, type PgEnum, pgEnum, type PgEnumColumnBuilderInitial } from "drizzle-orm/pg-core"
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

type TaggedUnionColumns<T> = {
  [K in keyof T]: PgColumnBuilderBase
}

export const taggedUnion = <
  K extends string,
  A extends { _tag: string },
  E,
  R,
  T extends Superset<A>,
  F extends TaggedUnionColumns<T>,
>(
  key: K,
  schema: S.Schema<A, E, R>,
  cols: F,
): {
  tag: PgEnum<[A["_tag"]]>
  superset:
    & {
      _tag: NotNull<
        PgEnumColumnBuilderInitial<"_tag", Extract<[A["_tag"]], [string, ...Array<string>]>>
      >
    }
    & F
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
      _tag: tag(`${key}_tag`).notNull(),
      ...cols,
    },
  } as never
}
