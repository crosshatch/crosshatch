import { Schema as S } from "effect"

export const make = <B extends string, F extends S.Struct.Fields>(
  id: S.brand<typeof S.String, B>,
  schema: S.Struct<F>,
) =>
  S.Struct({
    id,
    added: S.Date,
    ...schema.fields,
  })
