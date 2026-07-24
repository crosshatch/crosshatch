import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit, Schema as S } from "effect"

import { Ed25519Pair } from "../../Crypto/Crypto.ts"
import { findAssociatedTokenPda, findTokenTransferAccounts } from "./Instructions.ts"
import * as fixtures from "./Protocol.fixtures.gen.ts"
import {
  Address,
  addressFromPublicKey,
  Blockhash,
  buildTransactionMessage,
  compileTransaction,
  getAddMemoInstruction,
  getBase64EncodedWireTransaction,
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
  getTransferCheckedInstruction,
  partiallySignTransaction,
} from "./Protocol.ts"

describe(import.meta.url, () => {
  it.effect(
    "Address accepts a canonical address and rejects both malformed shapes",
    Effect.fn(function* () {
      const canonical = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      expect(yield* S.decodeEffect(Address)(canonical)).toBe(canonical)
      const illegalCharacter = yield* S.decodeEffect(Address)("OIl").pipe(Effect.exit)
      expect(Exit.isFailure(illegalCharacter)).toBeTruthy()
      const thirtyThreeBytes = yield* S.decodeEffect(Address)("1".repeat(33)).pipe(Effect.exit)
      expect(Exit.isFailure(thirtyThreeBytes)).toBeTruthy()
    }),
  )

  it.effect(
    "addressFromPublicKey base58-encodes Ed25519 keys exactly as solana kit",
    Effect.fn(function* () {
      for (const { seed, address } of fixtures.addresses) {
        const { publicKey } = yield* Ed25519Pair.fromSeed(seed)
        expect(yield* addressFromPublicKey(publicKey)).toBe(address)
      }
    }),
  )

  it.effect(
    "findAssociatedTokenPda derives every address exactly as solana kit",
    Effect.fn(function* () {
      for (const { owner, tokenProgram, mint, pda } of fixtures.associatedTokenPdas) {
        const derived = yield* findAssociatedTokenPda({
          owner: Address.make(owner),
          tokenProgram: Address.make(tokenProgram),
          mint: Address.make(mint),
        })
        expect(derived).toBe(pda)
      }
    }),
  )

  it.effect(
    "compute-budget and memo instructions encode identically to solana kit",
    Effect.fn(function* () {
      for (const { units, data } of fixtures.computeUnitLimits) {
        const { data: encoded } = yield* getSetComputeUnitLimitInstruction(units)
        expect(encoded).toStrictEqual(data)
      }
      for (const { microLamports, data } of fixtures.computeUnitPrices) {
        const { data: encoded } = yield* getSetComputeUnitPriceInstruction(microLamports)
        expect(encoded).toStrictEqual(data)
      }
      for (const { memo, data } of fixtures.memos) {
        const instruction = getAddMemoInstruction(memo)
        expect(instruction.data).toStrictEqual(data)
        expect(instruction.accounts).toStrictEqual([])
      }
    }),
  )

  it.effect(
    "transferChecked encodes the data and account roles exactly as solana kit",
    Effect.fn(function* () {
      for (const transfer of fixtures.transfers) {
        const instruction = yield* getTransferCheckedInstruction({
          source: Address.make(transfer.source),
          mint: Address.make(transfer.mint),
          destination: Address.make(transfer.destination),
          authority: Address.make(transfer.authority),
          tokenProgram: Address.make(transfer.tokenProgram),
          amount: transfer.amount,
          decimals: transfer.decimals,
        })
        expect(instruction.data).toStrictEqual(transfer.data)
        expect(instruction.accounts).toStrictEqual(transfer.accounts)
      }
    }),
  )

  it.effect(
    "compiled, partially-signed transactions are byte-for-byte identical to solana kit's wire format",
    Effect.fn(function* () {
      for (const transaction of fixtures.transactions) {
        const pair = yield* Ed25519Pair.fromSeed(transaction.signerSeed)
        const authority = yield* addressFromPublicKey(pair.publicKey)
        const tokenProgram = Address.make(transaction.tokenProgram)
        const mint = Address.make(transaction.mint)
        const { source, destination } = yield* findTokenTransferAccounts({
          sender: authority,
          recipient: Address.make(transaction.recipient),
          tokenProgram,
          mint,
        })

        const message = buildTransactionMessage({
          feePayer: Address.make(transaction.feePayer),
          lifetimeConstraint: {
            blockhash: Blockhash.make(transaction.blockhash),
            lastValidBlockHeight: 0n,
          },
          instructions: [
            yield* getSetComputeUnitLimitInstruction(transaction.units),
            yield* getSetComputeUnitPriceInstruction(transaction.microLamports),
            yield* getTransferCheckedInstruction({
              source,
              mint,
              destination,
              authority,
              tokenProgram,
              amount: transaction.amount,
              decimals: transaction.decimals,
            }),
            getAddMemoInstruction(transaction.memo),
          ],
        })

        const signed = yield* compileTransaction(message).pipe(
          Effect.flatMap((tx) => partiallySignTransaction([pair], tx)),
        )
        expect(yield* getBase64EncodedWireTransaction(signed)).toBe(transaction.wireBase64)
      }
    }),
  )
})
