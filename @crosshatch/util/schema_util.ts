import { Schema as S } from "effect"

export const filterTag = <
  A extends { _tag: string },
  const K extends A["_tag"],
>(_tag: K) =>
<I, R>(self: S.Schema<A, I, R>): S.Schema<Extract<A, { _tag: K }>, I, R> =>
  self.pipe(S.filter((v) => v._tag === _tag)) as never

export const makeId = <B extends symbol>(brand: B) => S.UUID.pipe(S.brand(brand))

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
