import { Schema as S } from "effect"

export type Version = typeof Version.Type
export const Version = S.Literal(2)
