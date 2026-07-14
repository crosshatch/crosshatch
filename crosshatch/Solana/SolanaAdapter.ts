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
import { Effect, Schema as S } from "effect"

import { CreatePayloadError } from "../Adapter.ts"
import * as Adapter from "../Adapter.ts"
import { GetLatestBlockhash } from "./GetLatestBlockhash.ts"
import * as SolanaAddress from "./SolanaAddress.ts"
import * as SolanaAsset from "./SolanaAsset.ts"
import { SolanaSigner } from "./SolanaSigner.ts"

export class SolanaAdapter extends Adapter.Service<SolanaAdapter>()("@crosshatch/SolanaAdapter") {}

export const layer = SolanaAdapter.layer(
  Effect.fnUntraced(function* ({ physical, accepted }) {
    const { feePayer, memo } = yield* S.decodeUnknownEffect(
      S.Struct({
        feePayer: SolanaAddress.SolanaAddress,
        memo: S.String.pipe(
          S.check(
            S.makeFilter((s) => new TextEncoder().encode(s).length <= 256, {
              expected: `a string of at most 256 UTF-8 bytes`,
            }),
          ),
          S.optional,
        ),
      }),
    )(accepted.extra)
    const mintAsset = yield* S.decodeUnknownEffect(SolanaAsset.SolanaAsset)(accepted.asset)
    const { tokenProgramId } = yield* S.decodeUnknownEffect(
      S.Struct({
        tokenProgramId: SolanaAddress.SolanaAddress,
      }),
    )(physical.metadata)

    return Effect.gen(function* () {
      const signer = yield* SolanaSigner
      const latestBlockhash = yield* GetLatestBlockhash.pipe(Effect.flatten)

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
              getSetComputeUnitLimitInstruction({ units: 100000 }),
              getSetComputeUnitPriceInstruction({ microLamports: 100000n }),
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
              ...(memo === undefined ? [] : [getAddMemoInstruction({ memo })]),
            ],
            v,
          ),
      )

      const transaction = yield* Effect.promise(() => partiallySignTransactionMessageWithSigners(message)).pipe(
        Effect.map(getBase64EncodedWireTransaction),
      )

      return { transaction }
    }).pipe(Effect.mapError((cause) => new CreatePayloadError({ cause })))
  }),
)
