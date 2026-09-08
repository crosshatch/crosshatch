import {
  getSetComputeUnitLimitInstruction,
  setTransactionMessageComputeUnitPrice,
} from "@solana-program/compute-budget"
import { findAssociatedTokenPda, getTransferCheckedInstruction } from "@solana-program/token"
import { address, type Address as SolanaAddress } from "@solana/addresses"
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  partiallySignTransactionMessageWithSigners,
  prependTransactionMessageInstruction,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  pipe as solanaPipe,
  type Base64EncodedWireTransaction,
} from "@solana/kit"
import { Crypto, Effect, Encoding, Schema as S } from "effect"

import { Scheme, Address, Adapt } from "../../index.ts"
import type { Solana } from "./Solana.ts"
import { SolanaClient } from "./SolanaClient.ts"
import { SolanaSigner } from "./SolanaSigner.ts"

export const Extra = S.Struct({
  feePayer: Address.AddressFromString,
  memo: S.String.pipe(
    S.check(
      S.makeFilter((s) => new TextEncoder().encode(s).length <= 256, {
        expected: `a string of at most 256 UTF-8 bytes`,
      }),
    ),
    S.optional,
  ),
})

export class SolanaScheme extends Scheme.Service<
  SolanaScheme,
  Solana,
  typeof Extra.Type,
  { readonly transaction: Base64EncodedWireTransaction }
>()("crosshatch/namespaces/Solana/SolanaScheme") {}

export const layer = SolanaScheme.layer(
  Extra,
  Effect.fnUntraced(
    function* ({ accepted, extra: { feePayer, memo } }) {
      if (accepted.network.namespace !== "solana") {
        return yield* new Adapt.AdaptError({ cause: new Error("Expected a Solana payment network") })
      }
      const signer = yield* SolanaSigner
      const { getLatestBlockhash, getMintMetadata } = yield* SolanaClient
      const mint = yield* Effect.try({
        try: () => address(accepted.asset),
        catch: (cause) => new Adapt.AdaptError({ cause }),
      })
      const { decimals, tokenProgram } = yield* getMintMetadata(mint, accepted.network.reference)
      const ata = (owner: SolanaAddress) =>
        Effect.tryPromise({
          try: () => findAssociatedTokenPda({ owner, tokenProgram, mint }),
          catch: (cause) => new Adapt.AdaptError({ cause }),
        })
      const payTo = yield* Effect.try({
        try: () => address(accepted.payTo),
        catch: (cause) => new Adapt.AdaptError({ cause }),
      })
      const [[sourceAta], [destAta]] = yield* Effect.all([ata(signer.address), ata(payTo)], {
        concurrency: "unbounded",
      })
      const transferIx = getTransferCheckedInstruction(
        {
          source: sourceAta,
          mint,
          destination: destAta,
          authority: signer,
          amount: BigInt(accepted.amount),
          decimals,
        },
        { programAddress: tokenProgram },
      )
      const crypto = yield* Crypto.Crypto
      const memoIx = {
        programAddress: MEMO_PROGRAM_ADDRESS,
        accounts: [] as const,
        data: new TextEncoder().encode(memo ?? Encoding.encodeHex(yield* crypto.randomBytes(16))),
      }
      const latestBlockhash = yield* getLatestBlockhash
      const message = solanaPipe(
        createTransactionMessage({ version: 0 }),
        (v) => setTransactionMessageComputeUnitPrice(COMPUTE_UNIT_PRICE_MICROLAMPORTS, v),
        (v) => setTransactionMessageFeePayer(address(feePayer.raw), v),
        (v) =>
          prependTransactionMessageInstruction(getSetComputeUnitLimitInstruction({ units: COMPUTE_UNIT_LIMIT }), v),
        (v) => appendTransactionMessageInstructions([transferIx, memoIx], v),
        (v) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, v),
      )
      const transaction = yield* Effect.tryPromise({
        try: (abortSignal) => partiallySignTransactionMessageWithSigners(message, { abortSignal }),
        catch: (cause) => new Adapt.AdaptError({ cause }),
      }).pipe(Effect.map(getBase64EncodedWireTransaction))
      return { transaction }
    },
    Effect.mapError((cause) => (cause instanceof Adapt.AdaptError ? cause : new Adapt.AdaptError({ cause }))),
    Effect.withSpan("SolanaScheme.adapt"),
  ),
)

const MEMO_PROGRAM_ADDRESS = address("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
const COMPUTE_UNIT_LIMIT = 20_000
const COMPUTE_UNIT_PRICE_MICROLAMPORTS = 1
