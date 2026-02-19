import { type PgColumnBuilderBrand, type AnyPgColumnBuilder } from "drizzle-orm/pg-core"
import { uuid } from "drizzle-orm/pg-core"

import { added, updated } from "./columns.ts"

export type ColumnsConfig<A> = {
  [K in Exclude<keyof A, "id" | "added" | "updated">]: AnyPgColumnBuilder & {
    readonly [PgColumnBuilderBrand]: { data: any } | { $type: any } // TODO: constrain again
  }
}

export const columnsCommon = <A extends { readonly id: string }>() => ({
  added,
  id: uuid("id").primaryKey().notNull().defaultRandom().$type<A["id"]>(),
  updated,
})
