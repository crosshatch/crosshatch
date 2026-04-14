import { Schema as S } from "effect"

export const EvmAddress = S.TemplateLiteral([S.Literal("0x"), S.String])

export const Address = S.Union([EvmAddress])
