import { PrintableAscii32 } from "@crosshatch/util"
import { Schema as S } from "effect"

export type ResourceInfo = typeof ResourceInfo.Type
export const ResourceInfo = S.Struct({
  description: S.String.pipe(S.optional),
  url: S.String.pipe(S.optional),
  mimeType: S.String.pipe(S.optional),
  serviceName: PrintableAscii32.pipe(S.optional),
  tags: S.Array(PrintableAscii32).check(S.isMaxLength(5)).pipe(S.optional),
  iconUrl: S.String.check(S.isLengthBetween(1, 2048), S.isPattern(/^https?:\/\/.+/u)).pipe(S.optional),
})
