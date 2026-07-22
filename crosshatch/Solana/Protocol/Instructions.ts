import { Effect, Schema as S } from "effect"

import { addressToBytes, findProgramDerivedAddress, SolanaProtocolAddress, type Address } from "./Address.ts"
import { AccountRole, type Instruction } from "./TransactionMessage.ts"

export const ASSOCIATED_TOKEN_PROGRAM_ADDRESS = SolanaProtocolAddress.make(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
)
export const COMPUTE_BUDGET_PROGRAM_ADDRESS = SolanaProtocolAddress.make("ComputeBudget111111111111111111111111111111")
export const MEMO_PROGRAM_ADDRESS = SolanaProtocolAddress.make("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")

const U32 = S.toType(S.Int.check(S.isBetween({ minimum: 0, maximum: 0xffffffff })))
const U8 = S.toType(S.Int.check(S.isBetween({ minimum: 0, maximum: 255 })))
const U64 = S.BigInt.check(S.isBetweenBigInt({ minimum: 0n, maximum: 0xffffffffffffffffn }))

const u32le = (value: number) => {
  const bytes = new Uint8Array(4)
  new DataView(bytes.buffer).setUint32(0, value, true)
  return bytes
}

const u64le = (value: bigint) => {
  const bytes = new Uint8Array(8)
  new DataView(bytes.buffer).setBigUint64(0, value, true)
  return bytes
}

const dataWithDiscriminator = (discriminator: number, ...fields: Uint8Array[]) => {
  const data = new Uint8Array(1 + fields.reduce((size, field) => size + field.length, 0))
  data[0] = discriminator
  let offset = 1
  for (const field of fields) {
    data.set(field, offset)
    offset += field.length
  }
  return data
}

export const getSetComputeUnitLimitInstruction = Effect.fnUntraced(function* (units: number) {
  const n = yield* S.decodeEffect(U32)(units)
  return {
    programAddress: COMPUTE_BUDGET_PROGRAM_ADDRESS,
    data: dataWithDiscriminator(2, u32le(n)),
  } satisfies Instruction
})

export const getSetComputeUnitPriceInstruction = Effect.fnUntraced(function* (microLamports: bigint) {
  const n = yield* S.decodeEffect(U64)(microLamports)
  return {
    programAddress: COMPUTE_BUDGET_PROGRAM_ADDRESS,
    data: dataWithDiscriminator(3, u64le(n)),
  } satisfies Instruction
})

export const getAddMemoInstruction = (memo: string): Instruction => ({
  programAddress: MEMO_PROGRAM_ADDRESS,
  accounts: [],
  data: new TextEncoder().encode(memo),
})

export interface TransferCheckedInput {
  readonly source: Address
  readonly mint: Address
  readonly destination: Address
  readonly authority: Address
  readonly tokenProgram: Address
  readonly amount: bigint
  readonly decimals: number
}

export const getTransferCheckedInstruction = Effect.fnUntraced(function* (input: TransferCheckedInput) {
  const amount = yield* S.decodeEffect(U64)(input.amount)
  const decimals = yield* S.decodeEffect(U8)(input.decimals)
  return {
    programAddress: input.tokenProgram,
    accounts: [
      { address: input.source, role: AccountRole.WRITABLE },
      { address: input.mint, role: AccountRole.READONLY },
      { address: input.destination, role: AccountRole.WRITABLE },
      { address: input.authority, role: AccountRole.READONLY_SIGNER },
    ],
    data: dataWithDiscriminator(12, u64le(amount), Uint8Array.of(decimals)),
  } satisfies Instruction
})

export const findAssociatedTokenPda = (input: {
  readonly owner: Address
  readonly tokenProgram: Address
  readonly mint: Address
}) =>
  findProgramDerivedAddress(ASSOCIATED_TOKEN_PROGRAM_ADDRESS, [
    addressToBytes(input.owner),
    addressToBytes(input.tokenProgram),
    addressToBytes(input.mint),
  ])
