import type { Address, Blockhash } from "./Address.ts"

export const AccountRole = {
  READONLY: 0,
  WRITABLE: 1,
  READONLY_SIGNER: 2,
  WRITABLE_SIGNER: 3,
} as const

export type AccountRole = (typeof AccountRole)[keyof typeof AccountRole]

export interface AccountMeta {
  readonly address: Address
  readonly role: AccountRole
}

export interface Instruction {
  readonly programAddress: Address
  readonly accounts?: ReadonlyArray<AccountMeta>
  readonly data?: Uint8Array
}

export interface LifetimeConstraint {
  readonly blockhash: Blockhash
  readonly lastValidBlockHeight: bigint
}

export interface TransactionMessage {
  readonly version: 0
  readonly feePayer: Address
  readonly lifetimeConstraint: LifetimeConstraint
  readonly instructions: ReadonlyArray<Instruction>
}

export const buildTransactionMessage = (input: {
  readonly feePayer: Address
  readonly lifetimeConstraint: LifetimeConstraint
  readonly instructions: ReadonlyArray<Instruction>
}): TransactionMessage => ({
  version: 0,
  feePayer: input.feePayer,
  lifetimeConstraint: input.lifetimeConstraint,
  instructions: input.instructions,
})
