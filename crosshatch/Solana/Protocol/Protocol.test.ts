// Test values obtained from https://github.com/saiashirwad/solana-kit-tests
import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit, Schema as S } from "effect"

import { Ed25519Pair } from "../../Crypto/Crypto.ts"
import {
  Address,
  addressFromPublicKey,
  Blockhash,
  buildTransactionMessage,
  compileTransaction,
  findAssociatedTokenAddress,
  findAssociatedTokenPda,
  getAddMemoInstruction,
  getBase64EncodedWireTransaction,
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
  getTransferCheckedInstruction,
  partiallySignTransaction,
} from "./Protocol.ts"

const USDC_MINT = Address.make("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
const TOKEN_PROGRAM = Address.make("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
const RECIPIENT = Address.make("6dNVSbxQBGeUncBSMBg5jGN4hJdaBhCPWyq4chSZq9dm")
const FEE_PAYER = Address.make("J2xccRtuG43drESLYznHhLhQkLTdfepcKYbiQ9BsJVaf")

const SEED = new Uint8Array(32).map((_, index) => index)
const KIT_SIGNER = "FAe4sisG95oZ42w7buUn5qEE4TAnfTTFPiguZUHmhiF"
const KIT_SIGNER_ATA = "hkcktF2Akp3vj8pbBVJuxJfk5m41i4t4TSVLx2VoNHT"
const KIT_RECIPIENT_ATA = "AWz9J9RUd6u684uixums7eiG8VqAcPft2i5SiX9Db41t"

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
    "addressFromPublicKey base58-encodes a seeded Ed25519 key exactly as solana kit",
    Effect.fn(function* () {
      const { publicKey } = yield* Ed25519Pair.fromSeed(SEED)
      expect(yield* addressFromPublicKey(publicKey)).toBe(KIT_SIGNER)
    }),
  )

  it.effect(
    "findAssociatedTokenPda derives the address and bump, exercising the on-curve rejection loop",
    Effect.fn(function* () {
      const pda = yield* findAssociatedTokenPda({
        owner: Address.make("4zvwRjXUKGfvwnParsHAS3HuSVzV5cA4McphgmoCtajS"),
        tokenProgram: TOKEN_PROGRAM,
        mint: USDC_MINT,
      })
      expect(pda).toStrictEqual(["DJcjpsHnWXSucjUpourygEN3mkcQwSHG6d5b2AzLSfSn", 250])
    }),
  )

  it.effect(
    "compute-budget and memo instructions encode identically to solana kit",
    Effect.fn(function* () {
      const limit = yield* getSetComputeUnitLimitInstruction(20000)
      expect(limit.data).toStrictEqual(Uint8Array.of(2, 32, 78, 0, 0))

      const price = yield* getSetComputeUnitPriceInstruction(1n)
      expect(price.data).toStrictEqual(Uint8Array.of(3, 1, 0, 0, 0, 0, 0, 0, 0))

      const memo = getAddMemoInstruction("crosshatch")
      expect(memo.data).toStrictEqual(Uint8Array.of(99, 114, 111, 115, 115, 104, 97, 116, 99, 104))
      expect(memo.accounts).toStrictEqual([])
    }),
  )

  it.effect(
    "transferChecked encodes the data and account roles exactly as solana kit",
    Effect.fn(function* () {
      const transfer = yield* getTransferCheckedInstruction({
        source: Address.make(KIT_SIGNER_ATA),
        mint: USDC_MINT,
        destination: Address.make(KIT_RECIPIENT_ATA),
        authority: Address.make(KIT_SIGNER),
        tokenProgram: TOKEN_PROGRAM,
        amount: 1000000n,
        decimals: 6,
      })
      expect(transfer.data).toStrictEqual(Uint8Array.of(12, 64, 66, 15, 0, 0, 0, 0, 0, 6))
      expect(transfer.accounts).toStrictEqual([
        { address: KIT_SIGNER_ATA, role: 1 },
        { address: USDC_MINT, role: 0 },
        { address: KIT_RECIPIENT_ATA, role: 1 },
        { address: KIT_SIGNER, role: 2 },
      ])
    }),
  )

  it.effect(
    "a compiled, partially-signed transaction is byte-for-byte identical to solana kit's wire format",
    Effect.fn(function* () {
      const pair = yield* Ed25519Pair.fromSeed(SEED)
      const authority = yield* addressFromPublicKey(pair.publicKey)
      const source = yield* findAssociatedTokenAddress({
        owner: authority,
        tokenProgram: TOKEN_PROGRAM,
        mint: USDC_MINT,
      })
      const destination = yield* findAssociatedTokenAddress({
        owner: RECIPIENT,
        tokenProgram: TOKEN_PROGRAM,
        mint: USDC_MINT,
      })

      const message = buildTransactionMessage({
        feePayer: FEE_PAYER,
        lifetimeConstraint: { blockhash: Blockhash.make("11111111111111111111111111111111"), lastValidBlockHeight: 0n },
        instructions: [
          yield* getSetComputeUnitLimitInstruction(20000),
          yield* getSetComputeUnitPriceInstruction(1n),
          yield* getTransferCheckedInstruction({
            source,
            mint: USDC_MINT,
            destination,
            authority,
            tokenProgram: TOKEN_PROGRAM,
            amount: 1000000n,
            decimals: 6,
          }),
          getAddMemoInstruction("crosshatch"),
        ],
      })

      const signed = yield* compileTransaction(message).pipe(
        Effect.flatMap((tx) => partiallySignTransaction([pair], tx)),
      )
      expect(yield* getBase64EncodedWireTransaction(signed)).toBe(
        "AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABrtuGeQ0m6a1FP3PNITH/tEn539Z5gKJItdnnmIK0BNJ/FFeT500XW+6TZWFzqk2RrQLVRO+WTXVMkbF7WblcBgAIBBAj9FyQ4WqDHW2T7eM1gL6HZkf3r92sTxY7XAurINen2GAOhB7/zzhC+HXDdGOdLwJln5NYwm6UNXx3chmQSVTG4jWejO5KwpnogDZOHV1OlQIwblI4/AfUvwvfP5UBe8a8KcIy4bpKMUMC6SeloQfOVDxcXdwdEyORVL202tbEDfgMGRm/lIRcy/+ytunLDm+e8jOW7xfcSayxDmzpAAAAAxvp6877brTo9ZfNqq8l0MbG75MLS9uDkfKYCA0UvXWEFSlNamSkhBk0k6HFg2jh8fDW13bySu4HkH6hAQQVEjQbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAAFAiBOAAAEAAkDAQAAAAAAAAAHBAMFAgEKDEBCDwAAAAAABgYACmNyb3NzaGF0Y2gA",
      )
    }),
  )
})
