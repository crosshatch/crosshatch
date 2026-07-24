import { getSetComputeUnitLimitInstruction, getSetComputeUnitPriceInstruction } from "@solana-program/compute-budget"
import { getAddMemoInstruction } from "@solana-program/memo"
import { findAssociatedTokenPda, getTransferCheckedInstruction } from "@solana-program/token"
import {
  address,
  appendTransactionMessageInstructions,
  compileTransaction,
  createKeyPairFromPrivateKeyBytes,
  createNoopSigner,
  createTransactionMessage,
  getAddressDecoder,
  getAddressFromPublicKey,
  getBase58Decoder,
  getBase64EncodedWireTransaction,
  partiallySignTransaction,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  type Address,
  type Blockhash,
  type ReadonlyUint8Array,
} from "@solana/kit"
import { Console, Effect, FileSystem, Path, pipe, Record } from "effect"
import { FastCheck } from "effect/testing"
import { Command } from "effect/unstable/cli"

const USDC_MINT = address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
const TOKEN_PROGRAM = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
const TOKEN_2022_PROGRAM = address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
const RECIPIENT = address("6dNVSbxQBGeUncBSMBg5jGN4hJdaBhCPWyq4chSZq9dm")

const GOLDEN_SEED = new Uint8Array(32).map((_, index) => index)
const SAMPLE_SEED = 271828
const U32_MAX = 0xffff_ffff
const U64_MAX = 2n ** 64n - 1n

const toAddress = (bytes: Uint8Array) => getAddressDecoder().decode(bytes)
const toBase58 = (bytes: Uint8Array) => getBase58Decoder().decode(bytes)
const addressFromSeed = async (seed: Uint8Array) => {
  const keyPair = await createKeyPairFromPrivateKeyBytes(seed)
  return getAddressFromPublicKey(keyPair.publicKey)
}

const sample = <A>(arbitrary: FastCheck.Arbitrary<A>, numRuns: number) =>
  FastCheck.sample(arbitrary, { seed: SAMPLE_SEED, numRuns })

const bytes32 = FastCheck.uint8Array({ minLength: 32, maxLength: 32 })
const u8 = FastCheck.integer({ min: 0, max: 255 })
const u32 = FastCheck.integer({ min: 0, max: U32_MAX })
const u64 = FastCheck.bigInt({ min: 0n, max: U64_MAX })
const memoText = FastCheck.oneof(
  FastCheck.string({ maxLength: 48 }),
  FastCheck.string({ unit: "grapheme", maxLength: 24 }),
)
const tokenProgram = FastCheck.constantFrom<Address>(TOKEN_PROGRAM, TOKEN_2022_PROGRAM)

const generateAddresses = () =>
  Promise.all(
    [GOLDEN_SEED, ...sample(bytes32, 31)].map(async (seed) => ({
      seed,
      address: await addressFromSeed(seed),
    })),
  )

const generateAssociatedTokenPdas = () =>
  Promise.all(
    [
      { owner: address("4zvwRjXUKGfvwnParsHAS3HuSVzV5cA4McphgmoCtajS"), tokenProgram: TOKEN_PROGRAM, mint: USDC_MINT },
      ...sample(FastCheck.record({ owner: bytes32, mint: bytes32, tokenProgram }), 31).map((input) => ({
        owner: toAddress(input.owner),
        mint: toAddress(input.mint),
        tokenProgram: input.tokenProgram,
      })),
    ].map(async (input) => {
      const [pda] = await findAssociatedTokenPda(input)
      return { ...input, pda }
    }),
  )

const generateComputeUnitLimits = () =>
  [0, 1, 20000, U32_MAX, ...sample(u32, 16)].map((units) => ({
    units,
    data: getSetComputeUnitLimitInstruction({ units }).data,
  }))

const generateComputeUnitPrices = () =>
  [0n, 1n, U64_MAX, ...sample(u64, 16)].map((microLamports) => ({
    microLamports,
    data: getSetComputeUnitPriceInstruction({ microLamports }).data,
  }))

const generateMemos = () =>
  ["", "crosshatch", "🚀 ünïcode ✓", ...sample(memoText, 16)].map((memo) => ({
    memo,
    data: getAddMemoInstruction({ memo }).data,
  }))

const generateTransfers = () =>
  sample(
    FastCheck.record({
      source: bytes32,
      mint: bytes32,
      destination: bytes32,
      authority: bytes32,
      tokenProgram,
      amount: u64,
      decimals: u8,
    }),
    24,
  ).map((input) => {
    const transfer = {
      ...input,
      source: toAddress(input.source),
      mint: toAddress(input.mint),
      destination: toAddress(input.destination),
      authority: toAddress(input.authority),
    }
    const instruction = getTransferCheckedInstruction(
      { ...transfer, authority: createNoopSigner(transfer.authority) },
      { programAddress: transfer.tokenProgram },
    )
    return {
      ...transfer,
      data: instruction.data,
      accounts: instruction.accounts.map(({ address, role }) => ({ address, role })),
    }
  })

interface TransactionInput {
  readonly signerSeed: Uint8Array
  readonly feePayer: Address
  readonly recipient: Address
  readonly mint: Address
  readonly tokenProgram: Address
  readonly blockhash: Blockhash
  readonly units: number
  readonly microLamports: bigint
  readonly amount: bigint
  readonly decimals: number
  readonly memo: string
}

const generateTransaction = async (input: TransactionInput) => {
  const {
    signerSeed,
    feePayer,
    recipient,
    mint,
    tokenProgram,
    blockhash,
    units,
    microLamports,
    amount,
    decimals,
    memo,
  } = input
  const keyPair = await createKeyPairFromPrivateKeyBytes(signerSeed)
  const authority = await getAddressFromPublicKey(keyPair.publicKey)
  const [source] = await findAssociatedTokenPda({ owner: authority, tokenProgram, mint })
  const [destination] = await findAssociatedTokenPda({ owner: recipient, tokenProgram, mint })
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(feePayer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash({ blockhash, lastValidBlockHeight: 0n }, tx),
    (tx) =>
      appendTransactionMessageInstructions(
        [
          getSetComputeUnitLimitInstruction({ units }),
          getSetComputeUnitPriceInstruction({ microLamports }),
          getTransferCheckedInstruction(
            { source, mint, destination, authority: createNoopSigner(authority), amount, decimals },
            { programAddress: tokenProgram },
          ),
          getAddMemoInstruction({ memo }),
        ],
        tx,
      ),
  )
  const signed = await partiallySignTransaction([keyPair], compileTransaction(message))
  return { ...input, wireBase64: getBase64EncodedWireTransaction(signed) }
}

const generateTransactions = async () => {
  const goldenTransaction: TransactionInput = {
    signerSeed: GOLDEN_SEED,
    feePayer: await addressFromSeed(new Uint8Array(32).fill(9)),
    recipient: RECIPIENT,
    mint: USDC_MINT,
    tokenProgram: TOKEN_PROGRAM,
    blockhash: "11111111111111111111111111111111" as Blockhash,
    units: 20000,
    microLamports: 1n,
    amount: 1000000n,
    decimals: 6,
    memo: "crosshatch",
  }
  const selfPayingTransaction: TransactionInput = {
    ...goldenTransaction,
    signerSeed: new Uint8Array(32).fill(7),
    feePayer: await addressFromSeed(new Uint8Array(32).fill(7)),
  }
  const sampledTransactions = await Promise.all(
    sample(
      FastCheck.record({
        signerSeed: bytes32,
        feePayerSeed: bytes32,
        recipient: bytes32,
        mint: bytes32,
        tokenProgram,
        blockhash: bytes32,
        units: u32,
        microLamports: u64,
        amount: u64,
        decimals: u8,
        memo: memoText,
      }),
      22,
    ).map(
      async ({ feePayerSeed, recipient, mint, blockhash, ...input }): Promise<TransactionInput> => ({
        ...input,
        feePayer: await addressFromSeed(feePayerSeed),
        recipient: toAddress(recipient),
        mint: toAddress(mint),
        blockhash: toBase58(blockhash) as Blockhash,
      }),
    ),
  )
  return Promise.all([goldenTransaction, selfPayingTransaction, ...sampledTransactions].map(generateTransaction))
}

type Value = string | number | bigint | ReadonlyUint8Array | Value[] | { readonly [key: string]: Value }

const isBytes = (value: Value): value is ReadonlyUint8Array => value instanceof Uint8Array

const literal = (value: Value): string => {
  if (isBytes(value)) return `Uint8Array.of(${value.join(", ")})`
  if (typeof value === "bigint") return `${value}n`
  if (typeof value === "string" || typeof value === "number") return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(literal).join(", ")}]`
  return `{ ${Record.collect(value, (key, field) => `${key}: ${literal(field)}`).join(", ")} }`
}

export const solanaFixtures = Command.make("solana-fixtures", {}).pipe(
  Command.withHandler(
    Effect.fn(function* () {
      const fixtures = {
        addresses: yield* Effect.promise(generateAddresses),
        associatedTokenPdas: yield* Effect.promise(generateAssociatedTokenPdas),
        computeUnitLimits: generateComputeUnitLimits(),
        computeUnitPrices: generateComputeUnitPrices(),
        memos: generateMemos(),
        transfers: generateTransfers(),
        transactions: yield* Effect.promise(generateTransactions),
      }
      const fs = yield* FileSystem.FileSystem
      const path = yield* Path.Path
      const out = path.join(import.meta.dirname, "..", "crosshatch", "Solana", "Protocol", "Protocol.fixtures.gen.ts")

      const exports = Record.collect(
        fixtures,
        (name, cases) => `export const ${name} = [\n${cases.map((c) => `  ${literal(c)},`).join("\n")}\n]\n`,
      )
      yield* fs.writeFileString(
        out,
        ["// Generated from @solana/kit using `tools/solana-fixtures.ts` — do not edit.", ...exports].join("\n"),
      )
      yield* Console.log(`Wrote ${out}`)
    }),
  ),
)
