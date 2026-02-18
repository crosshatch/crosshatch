import { Schema as S } from "effect"

export const Network = S.TemplateLiteral(S.String, S.Literal(":"), S.String)
