import { Schema as S } from "effect"

import { type ColumnsConfig, columnsCommon } from "./_common.ts"

export const structColumns = <A extends { readonly id: string }, I, R, C extends ColumnsConfig<A>>(
  _schema: S.Schema<A, I, R>,
  columns: C,
) => ({
  ...columnsCommon<A>(),
  ...columns,
})
