import { Schema as S } from "effect"

export const ResourceInfo = S.Struct({
  description: S.String,
  mimeType: S.String,
  url: S.String,
})
