import { Schema as S } from "effect"

export const ResourceInfo = S.Struct({
  description: S.String,
  url: S.String,
  mimeType: S.String.pipe(S.optional),
})
