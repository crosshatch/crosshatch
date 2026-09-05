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
>()("crosshatch/Eip155/Permit2Scheme") {}

const tokenProgramId = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"

// TODO:
declare const decimals: number

export const layer = SolanaScheme.layer(
  Extra,
  Effect.fnUntraced(
    function* ({ accepted, extra: { feePayer, memo } }) {
      const signer = yield* SolanaSigner
      const { getLatestBlockhash } = yield* SolanaClient
      const latestBlockhash = yield* getLatestBlockhash
      const mint = address(accepted.asset.raw)
      const tokenProgram = address(tokenProgramId)
      const ata = (owner: SolanaAddress) => Effect.promise(() => findAssociatedTokenPda({ owner, tokenProgram, mint }))
      const [[sourceAta], [destAta]] = yield* Effect.all([ata(signer.address), ata(address(accepted.payTo.raw))], {
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
      const message = solanaPipe(
        createTransactionMessage({ version: 0 }),
        (v) => setTransactionMessageComputeUnitPrice(COMPUTE_UNIT_PRICE_MICROLAMPORTS, v),
        (v) => setTransactionMessageFeePayer(address(feePayer.raw), v),
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
    Effect.mapError((cause) => new Adapt.AdaptError({ cause })),
  ),
)

const MEMO_PROGRAM_ADDRESS = address("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
const COMPUTE_UNIT_LIMIT = 20_000
const COMPUTE_UNIT_PRICE_MICROLAMPORTS = 1
