import { Schema as S } from "effect"

export const make = <B extends symbol, A, I, R>(id: S.brand<typeof S.UUID, B>, schema: S.Schema<A, I, R>) =>
  schema.pipe(
    S.extend(
      S.Struct({
        id,
        added: S.Date,
      }),
    ),
  )
