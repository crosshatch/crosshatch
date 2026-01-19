import type { AnyPgColumnBuilder, PgColumnBuilderBrand } from "drizzle-orm/pg-core"
import { Brand, Schema as S } from "effect"
import { added, brandedId, updated } from "./columns.ts"

// type WrapArray<T, N extends number> = N extends 1 ? T[]
//   : N extends 2 ? T[][]
//   : N extends 3 ? T[][][]
//   : N extends 4 ? T[][][][]
//   : N extends 5 ? T[][][][][]
//   : T
// type ResolveDimensions<T extends AnyPgColumnBuilder[PgColumnBuilderBrand]> = T["dimensions"] extends 1 | 2 | 3 | 4 | 5
//   ? WrapArray<T["driverParam"], T["dimensions"]> | string
//   : T["driverParam"]

export type ColumnsConfig<A> = {
  [K in Exclude<keyof A, "id" | "added" | "updated">]: AnyPgColumnBuilder & {
    readonly [PgColumnBuilderBrand]: { data: any } | { $type: any } // TODO: constrain again
  }
}

export type ColumnsCommon<B extends symbol> = {
  id: ReturnType<typeof brandedId<B>>
  added: typeof added
  updated: typeof updated
}
export const ColumnsCommon = <B extends symbol>(_id: S.brand<typeof S.UUID, B>): ColumnsCommon<B> => ({
  id: brandedId<B>(),
  added,
  updated,
})

export type BaseType<B extends symbol> = {
  id: string & Brand.Brand<B>
  added: Date
  updated: Date
}
export type BaseEncoded = {
  id: string
  added: string
  updated: string
}
export const Base = <B extends symbol>(id: S.brand<typeof S.UUID, B>) =>
  S.Struct({
    id,
    added: S.Date,
    updated: S.Date,
  })
