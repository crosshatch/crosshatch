import { Effect, flow, Schema as S } from "effect"

import * as Address from "./Address.ts"
import { concat, u32le, u64le, U8, U32, U64 } from "./Codec.ts"
import { ASSOCIATED_TOKEN_PROGRAM_ADDRESS, COMPUTE_BUDGET_PROGRAM_ADDRESS, MEMO_PROGRAM_ADDRESS } from "./Programs.ts"
import type { Token, Transfer } from "./TokenProgram.ts"
import { AccountRole, type Instruction } from "./TransactionMessage.ts"

const dataWithDiscriminator = (discriminator: number, ...fields: Uint8Array[]) =>
  concat(Uint8Array.of(discriminator), ...fields)

export const getSetComputeUnitLimitInstruction = (units: number): Effect.Effect<Instruction, S.SchemaError> =>
  S.decodeEffect(U32)(units).pipe(
    Effect.map((n) => ({ programAddress: COMPUTE_BUDGET_PROGRAM_ADDRESS, data: dataWithDiscriminator(2, u32le(n)) })),
  )

export const getSetComputeUnitPriceInstruction = (microLamports: bigint): Effect.Effect<Instruction, S.SchemaError> =>
  S.decodeEffect(U64)(microLamports).pipe(
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
  amount: rawAmount,
  decimals: rawDecimals,
  mint,
  tokenProgram,
}: Transfer): Effect.Effect<Instruction, S.SchemaError> =>
  Effect.all({
    amount: S.decodeEffect(U64)(rawAmount),
    decimals: S.decodeEffect(U8)(rawDecimals),
  }).pipe(
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

export const findAssociatedTokenPda = ({ owner, tokenProgram, mint }: Token & { readonly owner: Address.Address }) =>
  Address.findProgramDerivedAddress(ASSOCIATED_TOKEN_PROGRAM_ADDRESS, [
    Address.toBytes(owner),
    Address.toBytes(tokenProgram),
    Address.toBytes(mint),
  ])

export const findAssociatedTokenAddress = flow(
  findAssociatedTokenPda,
  Effect.map(([address]) => address),
)

export const findTokenTransferAccounts = ({
  sender,
  recipient,
  ...token
}: Token & { readonly sender: Address.Address; readonly recipient: Address.Address }) =>
  Effect.all({
    source: findAssociatedTokenAddress({ ...token, owner: sender }),
    destination: findAssociatedTokenAddress({ ...token, owner: recipient }),
  })
