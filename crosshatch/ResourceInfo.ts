import { Schema as S } from "effect"

export type ResourceInfo = typeof ResourceInfo.Type
export const ResourceInfo = S.Struct({
  description: S.String.pipe(S.optional),
  url: S.String.pipe(S.optional),
  mimeType: S.String.pipe(S.optional),
})
