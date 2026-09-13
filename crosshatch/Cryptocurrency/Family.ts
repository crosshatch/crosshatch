import * as Proto from "../_Proto.ts"
import type * as Unit from "../Unit.ts"

const TypeId = Proto.id("Family")

export interface FamilySpec<U extends Unit.Any, K extends string> {
  readonly unit: U

  readonly symbol: K
}

export interface Family<U extends Unit.Any, K extends string> extends FamilySpec<U, K> {
  readonly [TypeId]: typeof TypeId
}

export type Any = Family<Unit.Any, string>

export const make = <U extends Unit.Any, K extends string>(spec: FamilySpec<U, K>): Family<U, K> => ({
  [TypeId]: TypeId,
  ...spec,
})
