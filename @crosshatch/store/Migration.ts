import { Schema as S } from "effect"

export const Migration = S.Struct({
  idx: S.Int,
  when: S.Int,
  tag: S.String,
  hash: S.String,
  sql: S.Array(S.String),
})
