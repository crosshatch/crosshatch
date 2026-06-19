import { Schema as S } from "effect"

export const Prerequisite = S.TaggedUnion({
  Deposit: {},
  RaiseAllowance: {},
  Vend: {},
  ThawApp: {},
  ThawAccount: {},
})

export const Prerequisites = S.NonEmptyArray(Prerequisite)
