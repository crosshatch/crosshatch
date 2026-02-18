import { Schema as S } from "effect"

export const makeId = <B extends symbol>(brand: B, identifier: string) =>
  S.UUID.pipe(S.brand(brand), S.annotations({ identifier }))

export const UnknownRecord = S.Record({
  key: S.String,
  value: S.Unknown,
})
