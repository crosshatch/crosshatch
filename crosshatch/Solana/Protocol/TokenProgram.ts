import type { Address } from "./Address.ts"

export interface Token {
  readonly mint: Address
  readonly tokenProgram: Address
}

export interface Transfer extends Token {
  readonly source: Address
  readonly destination: Address
  readonly authority: Address
  readonly amount: bigint
  readonly decimals: number
}
