import { Schema as S } from "effect"

export const Migration = S.Struct({
  hash: S.String,
  idx: S.Int,
  sql: S.Array(S.String),
  tag: S.String,
  when: S.Number,
})
