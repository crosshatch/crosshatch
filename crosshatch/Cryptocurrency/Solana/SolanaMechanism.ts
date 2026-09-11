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

import { Mechanism } from "../../index.ts"
import { MakePayloadError } from "../../Mechanism.ts"
import { Solana } from "./Solana.ts"
import { SolanaClient } from "./SolanaClient.ts"
import { SolanaSigner } from "./SolanaSigner.ts"

export const Extra = S.Struct({
  feePayer: Solana.Address,
  memo: S.String.pipe(
    S.check(
      S.makeFilter((s) => new TextEncoder().encode(s).length <= 256, {
        expected: `a string of at most 256 UTF-8 bytes`,
      }),
    ),
    S.optionalKey,
  ),
})

export class SolanaMechanism extends Mechanism.Service<
  SolanaMechanism,
  typeof Extra.Type,
  { readonly transaction: Base64EncodedWireTransaction }
>()("crosshatch/Cryptocurrency/Solana/SolanaMechanism") {}

export const layer = Mechanism.layer(
  SolanaMechanism,
  Effect.fnUntraced(
    function* (accepted, { feePayer, memo }) {
      const signer = yield* SolanaSigner
      const { getLatestBlockhash, getMintMetadata } = yield* SolanaClient
      const mint = address(accepted.asset)
      const { decimals, programAddress } = yield* getMintMetadata(mint, accepted.network.reference)
      const ata = (owner: SolanaAddress) =>
        Effect.tryPromise(() =>
          findAssociatedTokenPda({
            owner,
            tokenProgram: programAddress,
            mint,
          }),
        )
      const payTo = address(accepted.payTo)
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
        { programAddress },
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
        (v) => setTransactionMessageFeePayer(address(feePayer), v),
        (v) =>
          prependTransactionMessageInstruction(getSetComputeUnitLimitInstruction({ units: COMPUTE_UNIT_LIMIT }), v),
        (v) => appendTransactionMessageInstructions([transferIx, memoIx], v),
        (v) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, v),
      )
      const transaction = yield* Effect.tryPromise((abortSignal) =>
        partiallySignTransactionMessageWithSigners(message, { abortSignal }),
      ).pipe(Effect.map(getBase64EncodedWireTransaction))
      return { transaction }
    },
    Effect.mapError((cause) => new MakePayloadError({ cause })),
  ),
)

const MEMO_PROGRAM_ADDRESS = address("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
const COMPUTE_UNIT_LIMIT = 20_000
const COMPUTE_UNIT_PRICE_MICROLAMPORTS = 1
