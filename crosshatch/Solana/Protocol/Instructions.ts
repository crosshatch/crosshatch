import { Effect, flow, Schema as S } from "effect"

import * as Address from "./Address.ts"
import { concat, u32le, u64le, U8, U32, U64 } from "./Codec.ts"
import { ASSOCIATED_TOKEN_PROGRAM_ADDRESS, COMPUTE_BUDGET_PROGRAM_ADDRESS, MEMO_PROGRAM_ADDRESS } from "./Programs.ts"
import { AccountRole, type Instruction } from "./TransactionMessage.ts"

const dataWithDiscriminator = (discriminator: number, ...fields: Uint8Array[]) =>
  concat(Uint8Array.of(discriminator), ...fields)

export const getSetComputeUnitLimitInstruction = (units: number): Effect.Effect<Instruction, S.SchemaError> =>
  S.decodeEffect(U32)(units).pipe(
    Effect.map((n) => ({
      programAddress: COMPUTE_BUDGET_PROGRAM_ADDRESS,
      data: dataWithDiscriminator(2, u32le(n)),
    })),
  )

export const getSetComputeUnitPriceInstruction = (microLamports: bigint): Effect.Effect<Instruction, S.SchemaError> =>
  S.decodeEffect(U64)(microLamports).pipe(
    Effect.map((n) => ({
      programAddress: COMPUTE_BUDGET_PROGRAM_ADDRESS,
      data: dataWithDiscriminator(3, u64le(n)),
    })),
  )

export const getAddMemoInstruction = (memo: string): Instruction => ({
  programAddress: MEMO_PROGRAM_ADDRESS,
  accounts: [],
  data: new TextEncoder().encode(memo),
})

export const getTransferCheckedInstruction = (input: {
  readonly source: Address.Address
  readonly mint: Address.Address
  readonly destination: Address.Address
  readonly authority: Address.Address
  readonly tokenProgram: Address.Address
  readonly amount: bigint
  readonly decimals: number
}): Effect.Effect<Instruction, S.SchemaError> =>
  Effect.all({
    amount: S.decodeEffect(U64)(input.amount),
    decimals: S.decodeEffect(U8)(input.decimals),
  }).pipe(
    Effect.map(({ amount, decimals }) => ({
      programAddress: input.tokenProgram,
      accounts: [
        { address: input.source, role: AccountRole.WRITABLE },
        { address: input.mint, role: AccountRole.READONLY },
        { address: input.destination, role: AccountRole.WRITABLE },
        { address: input.authority, role: AccountRole.READONLY_SIGNER },
      ],
      data: dataWithDiscriminator(12, u64le(amount), Uint8Array.of(decimals)),
    })),
  )

export const findAssociatedTokenPda = ({
  owner,
  tokenProgram,
  mint,
}: {
  readonly owner: Address.Address
  readonly tokenProgram: Address.Address
  readonly mint: Address.Address
}) =>
  Address.findProgramDerivedAddress(ASSOCIATED_TOKEN_PROGRAM_ADDRESS, [
    Address.toBytes(owner),
    Address.toBytes(tokenProgram),
    Address.toBytes(mint),
  ])

export const findAssociatedTokenAddress = flow(
  findAssociatedTokenPda,
  Effect.map(([address]) => address),
)

export const findTokenTransferAccounts = (input: {
  readonly tokenProgram: Address.Address
  readonly mint: Address.Address
  readonly sender: Address.Address
  readonly recipient: Address.Address
}) =>
  Effect.all({
    source: findAssociatedTokenAddress({ ...input, owner: input.sender }),
    destination: findAssociatedTokenAddress({ ...input, owner: input.recipient }),
  })
