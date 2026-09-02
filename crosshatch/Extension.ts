import { Schema as S } from "effect"

export type ExtensionsEnvelope = typeof ExtensionsEnvelope.Type
export const ExtensionsEnvelope = S.Record(
  S.String,
  S.Struct({
    info: S.Json,
    schema: S.Json,
  }),
)
