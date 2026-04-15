import { Schema as S } from "effect"

export const EvmAddress = S.TemplateLiteral([S.Literal("0x"), S.String])

export const SolanaAddress = S.String.check(S.isPattern(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/))

export const Address = S.Union([EvmAddress, SolanaAddress])
