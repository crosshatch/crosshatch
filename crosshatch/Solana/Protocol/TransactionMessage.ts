import type { Address, Blockhash } from "./Address.ts"

export const AccountRole = { READONLY: 0, WRITABLE: 1, READONLY_SIGNER: 2, WRITABLE_SIGNER: 3 }
export type AccountRole = (typeof AccountRole)[keyof typeof AccountRole]

export interface Instruction {
  readonly programAddress: Address
  readonly accounts?: ReadonlyArray<{
    readonly address: Address
    readonly role: AccountRole
  }>
  readonly data?: Uint8Array
}

export interface TransactionMessage {
  readonly version: 0
  readonly feePayer: Address
  readonly lifetimeConstraint: {
    readonly blockhash: Blockhash
    readonly lastValidBlockHeight: bigint
  }
  readonly instructions: ReadonlyArray<Instruction>
}

export const buildTransactionMessage = (input: Omit<TransactionMessage, "version">): TransactionMessage => ({
  version: 0,
  ...input,
})
