import { Schema as S } from "effect"

export const TraceConfig = S.Struct({
  traceId: S.String,
  title: S.String,
  description: S.String,
})
