import { Schema as S } from "effect"

export const Migration = S.Struct({
  idx: S.Int,
  tag: S.String,
  hash: S.String,
  when: S.Number,
  sql: S.Array(S.String),
})
