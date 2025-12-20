import { Schema as S } from "effect"

export class Migration extends S.Class<Migration>("Migration")({
  idx: S.Int,
  when: S.Int,
  tag: S.String,
  hash: S.String,
  sql: S.Array(S.String),
}) {}
