import { getSetComputeUnitLimitInstruction, getSetComputeUnitPriceInstruction } from "@solana-program/compute-budget"
import { getAddMemoInstruction } from "@solana-program/memo"
import { findAssociatedTokenPda, getTransferCheckedInstruction } from "@solana-program/token"
import { address, type Address } from "@solana/addresses"
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  partiallySignTransactionMessageWithSigners,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  pipe as solanaPipe,
} from "@solana/kit"
import { Effect, Encoding, Schema as S } from "effect"

import { Random } from "../Crypto/Crypto.ts"
import * as Scheme from "../Scheme.ts"
import * as SolanaAddress from "./SolanaAddress.ts"
import * as SolanaAsset from "./SolanaAsset.ts"
import { SolanaSigner } from "./SolanaSigner.ts"
import { SolanaState } from "./SolanaState.ts"

export const Known = S.Struct({
  tokenProgramId: SolanaAddress.SolanaAddress,
})

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

export class SolanaScheme extends Scheme.Service<SolanaScheme, typeof Known.Type, typeof Extra.Type>()(
  "@crosshatch/Solana/SolanaScheme",
) {}

export const layer = SolanaScheme.layer(
  { known: Known, extra: Extra },
  ({ known: { tokenProgramId }, extra: { feePayer, memo } }) =>
    Effect.fnUntraced(
      function* ({ physical, accepted }) {
        const signer = yield* SolanaSigner
        const { getLatestBlockhash } = yield* SolanaState
        const latestBlockhash = yield* getLatestBlockhash

        const mintAsset = yield* S.decodeUnknownEffect(SolanaAsset.SolanaAsset)(accepted.asset)
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
        const [[sourceAta], [destAta]] = yield* Effect.all([ata(signer.address), ata(address(accepted.payTo))])

        const message = solanaPipe(
          createTransactionMessage({ version: 0 }),
          (v) => setTransactionMessageFeePayer(address(feePayer), v),
          (v) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, v),
          (v) =>
            appendTransactionMessageInstructions(
              [
                getSetComputeUnitLimitInstruction({ units: 20000 }),
                getSetComputeUnitPriceInstruction({ microLamports: 1n }),
                getTransferCheckedInstruction(
                  {
                    source: sourceAta,
                    mint,
                    destination: destAta,
                    authority: signer,
                    amount: BigInt(accepted.amount),
                    decimals: physical.decimals,
                  },
                  { programAddress: tokenProgram },
                ),
                getAddMemoInstruction({ memo: memo ?? Encoding.encodeHex(Random.bytes(16)) }),
              ],
              v,
            ),
        )

        const transaction = yield* Effect.promise(() => partiallySignTransactionMessageWithSigners(message)).pipe(
          Effect.map(getBase64EncodedWireTransaction),
        )

        return { transaction }
      },
      Effect.mapError((cause) => new Scheme.CreatePayloadError({ cause })),
    ),
)
