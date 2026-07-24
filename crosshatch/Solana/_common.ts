import { Schema as S } from "effect"

export const brand = S.brand("crosshatch/Solana")

// BIP-44 default Solana account: m/44'/501'/0'/0'
export const SOLANA_DERIVATION_PATH = [44, 501, 0, 0] as const
