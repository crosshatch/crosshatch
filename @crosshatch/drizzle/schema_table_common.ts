import type { PgColumnBuilderBase } from "drizzle-orm/pg-core"
import { Schema as S } from "effect"
import { added, brandedId, updated } from "./columns.ts"

export type ColumnsConfig<A> = {
  [K in Exclude<keyof A, "id" | "added" | "updated">]: PgColumnBuilderBase & { _: { data: A[K] } | { $type: A[K] } }
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

export const extendBase = <B extends symbol>(id: S.brand<typeof S.UUID, B>) =>
  S.extend(S.Struct({
    id,
    added: S.Date,
    updated: S.Date,
  }))
