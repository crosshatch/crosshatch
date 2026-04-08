import type { PgEnum } from "drizzle-orm/pg-core"
import type { PgArrayDimension, PgColumnBuilderBrand, AnyPgColumnBuilder } from "drizzle-orm/pg-core"
import { Types, Array } from "effect"

type Increment<N extends PgArrayDimension> = N extends 0
  ? 1
  : N extends 1
    ? 2
    : N extends 2
      ? 3
      : N extends 3
        ? 4
        : N extends 4
          ? 5
          : never

type UnwrapArray<T, Depth extends PgArrayDimension = 0> = Depth extends 5
  ? { base: T; depth: 5 }
  : T extends readonly (infer U)[]
    ? UnwrapArray<U, Increment<Depth>>
    : { base: T; depth: Depth }

export type ColumnsConfig<A, E> = {
  [K in Exclude<keyof A, E>]: UnwrapArray<NonNullable<A[K]>> extends infer R extends {
    base: unknown
    depth: PgArrayDimension
  }
    ? AnyPgColumnBuilder & {
        readonly [PgColumnBuilderBrand]: ({ data: R["base"] } | { $type: R["base"] }) &
          (R["depth"] extends 0 ? {} : { dimensions: R["depth"] })
      }
    : never
}

type SupersetKey<U extends { _tag: string }> = Exclude<
  {
    readonly [K in Types.Tags<U>]: keyof Types.ExtractTag<U, K>
  }[Types.Tags<U>],
  "_tag"
>
type Superset<U extends { _tag: string }> = {
  [K in SupersetKey<U>]: {
    [K2 in Types.Tags<U>]: Types.ExtractTag<U, K2> extends Record<K, infer V> ? V : never
  }[Types.Tags<U>]
}

// TODO: ensure correspondence to the Common type?
export const columnsFactory = <Common extends Record<string, AnyPgColumnBuilder>>(common: Common) => ({
  taggedUnion:
    <A extends { readonly _tag: string }>() =>
    <C extends ColumnsConfig<Superset<A>, Extract<keyof Common, string> | "_tag">>(
      tagEnum: PgEnum<Array.NonEmptyArray<A["_tag"]>>,
      columns: C,
    ) => ({
      _tag: tagEnum("_tag").notNull(),
      ...common,
      ...columns,
    }),
  struct:
    <A extends { readonly id: string }>() =>
    <C extends ColumnsConfig<A, Extract<keyof Common, string>>>(columns: C) => ({
      ...common,
      ...columns,
    }),
})
