import { Token } from "../index.ts"

const symbol = "USDC" as const

export interface USDC extends Token.Token<typeof symbol> {}
export const USDC: USDC = Token.make({ symbol })
