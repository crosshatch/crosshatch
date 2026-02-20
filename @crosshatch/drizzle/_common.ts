import { type PgArrayDimension, type PgColumnBuilderBrand, type AnyPgColumnBuilder } from "drizzle-orm/pg-core"
import { uuid } from "drizzle-orm/pg-core"

import { added, updated } from "./columns.ts"

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

type NonNullish<T> = T & {}

type UnwrapArray<T, Depth extends PgArrayDimension = 0> = Depth extends 5
  ? { base: T; depth: 5 }
  : T extends readonly (infer U)[]
    ? UnwrapArray<U, Increment<Depth>>
    : { base: T; depth: Depth }

export type ColumnsConfig<A> = {
  [K in Exclude<keyof A, "id" | "added" | "updated">]: UnwrapArray<NonNullish<A[K]>> extends infer R extends {
    base: unknown
    depth: PgArrayDimension
  }
    ? AnyPgColumnBuilder & {
        readonly [PgColumnBuilderBrand]: ({ data: R["base"] } | { $type: R["base"] }) &
          (R["depth"] extends 0 ? {} : { dimensions: R["depth"] })
      }
    : never
}

export const columnsCommon = <A extends { readonly id: string }>() => ({
  added,
  id: uuid("id").primaryKey().notNull().defaultRandom().$type<A["id"]>(),
  updated,
})
