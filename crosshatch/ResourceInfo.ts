import { Schema as S } from "effect"

/** Printable ASCII (U+0020–U+007E), 1–32 characters. */
const PrintableAscii32 = S.String.check(S.isLengthBetween(1, 32), S.isPattern(/^[\u0020-\u007E]+$/u))

export type ResourceInfo = typeof ResourceInfo.Type
export const ResourceInfo = S.Struct({
  description: S.String.pipe(S.optional),
  url: S.String.pipe(S.optional),
  mimeType: S.String.pipe(S.optional),
  serviceName: PrintableAscii32.pipe(S.optional),
  tags: S.Array(PrintableAscii32).check(S.isMaxLength(5)).pipe(S.optional),
  iconUrl: S.String.check(S.isLengthBetween(1, 2048), S.isPattern(/^https?:\/\/.+/u)).pipe(S.optional),
})
