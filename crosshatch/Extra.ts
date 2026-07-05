import { Schema as S, Tuple } from "effect"

export const Extra = S.Record(S.String, S.Unknown)

export const assign = Tuple.map(
  S.fieldsAssign({
    extra: Extra.pipe(S.optional),
  }),
)
