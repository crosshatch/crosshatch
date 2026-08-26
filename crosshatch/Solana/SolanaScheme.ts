import {
  getSetComputeUnitLimitInstruction,
  setTransactionMessageComputeUnitPrice,
} from "@solana-program/compute-budget"
import { findAssociatedTokenPda, getTransferCheckedInstruction } from "@solana-program/token"
import { address, type Address } from "@solana/addresses"
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  partiallySignTransactionMessageWithSigners,
  prependTransactionMessageInstruction,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  pipe as solanaPipe,
} from "@solana/kit"
import { Effect, Encoding, Schema as S } from "effect"

import * as Random from "../Crypto/Random.ts"
import * as Scheme from "../Scheme.ts"
import * as SolanaAddress from "./SolanaAddress.ts"
import * as SolanaAsset from "./SolanaAsset.ts"
import { SolanaSigner } from "./SolanaSigner.ts"
import { SolanaState } from "./SolanaState.ts"

const MEMO_PROGRAM_ADDRESS = address("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
const COMPUTE_UNIT_LIMIT = 20_000
const COMPUTE_UNIT_PRICE_MICROLAMPORTS = 1

export type Known = typeof Known.Type
export const Known = S.Struct({
  tokenProgramId: SolanaAddress.SolanaAddress,
})

export type Extra = typeof Extra.Type
export const Extra = S.Struct({
  feePayer: SolanaAddress.SolanaAddress,
  memo: S.String.pipe(
    S.check(
      S.makeFilter((s) => new TextEncoder().encode(s).length <= 256, {
        expected: `a string of at most 256 UTF-8 bytes`,
      }),
    ),
    S.optional,
  ),
})

export class SolanaScheme extends Scheme.Service<SolanaScheme, Known, Extra>()("@crosshatch/Solana/SolanaScheme") {}

export const layer = SolanaScheme.layer(
  { known: Known, extra: Extra },
  ({ known: { tokenProgramId }, extra: { feePayer, memo } }) =>
    Effect.fnUntraced(
      function* ({ physical, accepted }) {
        const signer = yield* SolanaSigner
        const { getLatestBlockhash } = yield* SolanaState
        const latestBlockhash = yield* getLatestBlockhash

        const mintAsset = yield* S.decodeEffect(SolanaAsset.SolanaAsset)(accepted.asset)
        const mint = address(mintAsset)
        const tokenProgram = address(tokenProgramId)

        const ata = (owner: Address) =>
          Effect.promise(() =>
            findAssociatedTokenPda({
              owner: address(owner),
              tokenProgram,
              mint,
            }),
          )
        const [[sourceAta], [destAta]] = yield* Effect.all([ata(signer.address), ata(address(accepted.payTo))], {
          concurrency: "unbounded",
        })

        const transferIx = getTransferCheckedInstruction(
          {
            source: sourceAta,
            mint,
            destination: destAta,
            authority: signer,
            amount: BigInt(accepted.amount),
            decimals: physical.decimals,
          },
          { programAddress: tokenProgram },
        )
        const memoIx = {
          programAddress: MEMO_PROGRAM_ADDRESS,
          accounts: [] as const,
          data: new TextEncoder().encode(memo ?? Encoding.encodeHex(Random.bytes(16))),
        }

        const message = solanaPipe(
          createTransactionMessage({ version: 0 }),
          (v) => setTransactionMessageComputeUnitPrice(COMPUTE_UNIT_PRICE_MICROLAMPORTS, v),
          (v) => setTransactionMessageFeePayer(address(feePayer), v),
          (v) =>
            prependTransactionMessageInstruction(getSetComputeUnitLimitInstruction({ units: COMPUTE_UNIT_LIMIT }), v),
          (v) => appendTransactionMessageInstructions([transferIx, memoIx], v),
          (v) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, v),
        )

        const transaction = yield* Effect.promise(() => partiallySignTransactionMessageWithSigners(message)).pipe(
          Effect.map(getBase64EncodedWireTransaction),
        )

        return { transaction }
      },
      Effect.mapError((cause) => new Scheme.CreatePayloadError({ cause })),
    ),
)
