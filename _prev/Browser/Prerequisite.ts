import { Schema as S } from "effect"

export type Prerequisite = typeof Prerequisite.Type
export const Prerequisite = S.TaggedUnion({
  Deposit: {},
  RaiseAllowance: {},
  Vend: {},
  ThawApp: {},
  ThawAccount: {},
})

export type Prerequisites = typeof Prerequisites.Type
export const Prerequisites = S.NonEmptyArray(Prerequisite)

export class PrerequisitesUnmetError extends S.TaggedError<PrerequisitesUnmetError>()("PrerequisitesUnmetError", {
  prerequisites: Prerequisites,
}) {}
