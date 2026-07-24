import { Effect, pipe, Schema as S } from "effect"

import { Address, toBytes, findProgramDerivedAddress } from "./Address.ts"
import { concat, u32le, u64le, U8, U32, U64 } from "./Codec.ts"
import { AccountRole, type Instruction } from "./TransactionMessage.ts"

const ASSOCIATED_TOKEN_PROGRAM_ADDRESS = Address.make("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
const COMPUTE_BUDGET_PROGRAM_ADDRESS = Address.make("ComputeBudget111111111111111111111111111111")
const MEMO_PROGRAM_ADDRESS = Address.make("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")

interface Token {
  readonly mint: Address
  readonly tokenProgram: Address
}

const dataWithDiscriminator = (discriminator: number, ...fields: Uint8Array[]) =>
  concat(Uint8Array.of(discriminator), ...fields)

export const getSetComputeUnitLimitInstruction = (units: number): Effect.Effect<Instruction, S.SchemaError> =>
  pipe(
    units,
    S.decodeEffect(U32),
    Effect.map((n) => ({ programAddress: COMPUTE_BUDGET_PROGRAM_ADDRESS, data: dataWithDiscriminator(2, u32le(n)) })),
  )

export const getSetComputeUnitPriceInstruction = (microLamports: bigint): Effect.Effect<Instruction, S.SchemaError> =>
  pipe(
    microLamports,
    S.decodeEffect(U64),
    Effect.map((n) => ({ programAddress: COMPUTE_BUDGET_PROGRAM_ADDRESS, data: dataWithDiscriminator(3, u64le(n)) })),
  )

export const getAddMemoInstruction = (memo: string): Instruction => ({
  programAddress: MEMO_PROGRAM_ADDRESS,
  accounts: [],
  data: new TextEncoder().encode(memo),
})

export const getTransferCheckedInstruction = ({
  source,
  destination,
  authority,
  amount,
  decimals,
  mint,
  tokenProgram,
}: Token & {
  readonly source: Address
  readonly destination: Address
  readonly authority: Address
  readonly amount: bigint
  readonly decimals: number
}): Effect.Effect<Instruction, S.SchemaError> =>
  pipe(
    Effect.all({ amount: S.decodeEffect(U64)(amount), decimals: S.decodeEffect(U8)(decimals) }),
    Effect.map(({ amount, decimals }) => ({
      programAddress: tokenProgram,
      accounts: [
        { address: source, role: AccountRole.WRITABLE },
        { address: mint, role: AccountRole.READONLY },
        { address: destination, role: AccountRole.WRITABLE },
        { address: authority, role: AccountRole.READONLY_SIGNER },
      ],
      data: dataWithDiscriminator(12, u64le(amount), Uint8Array.of(decimals)),
    })),
  )

export const findAssociatedTokenPda = ({ owner, tokenProgram, mint }: Token & { readonly owner: Address }) =>
  findProgramDerivedAddress(ASSOCIATED_TOKEN_PROGRAM_ADDRESS, [toBytes(owner), toBytes(tokenProgram), toBytes(mint)])

export const findTokenTransferAccounts = ({
  sender,
  recipient,
  ...token
}: Token & { readonly sender: Address; readonly recipient: Address }) =>
  Effect.all({
    source: findAssociatedTokenPda({ ...token, owner: sender }),
    destination: findAssociatedTokenPda({ ...token, owner: recipient }),
  })
