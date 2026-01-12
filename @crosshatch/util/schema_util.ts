import { Schema as S } from "effect"

export const makeId = <B extends symbol>(brand: B, identifier: string) =>
  S.UUID.pipe(
    S.brand(brand),
    S.annotations({ identifier }),
  )

export const TableStruct = <
  B extends symbol,
  Fields extends S.Struct.Fields = {},
>(id: S.brand<typeof S.UUID, B>, fields: Fields = {} as never) =>
  S.Struct({
    id,
    added: S.Date,
    updated: S.Date,
    ...fields,
  })
