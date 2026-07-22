import { Effect, Encoding, Schema as S } from "effect"

import { Random } from "../Crypto/Crypto.ts"
import * as Scheme from "../Scheme.ts"
import {
  SvmAddress,
  buildTransactionMessage,
  compileTransaction,
  findAssociatedTokenPda,
  getAddMemoInstruction,
  getBase64EncodedWireTransaction,
  getSetComputeUnitLimitInstruction,
  getSetComputeUnitPriceInstruction,
  getTransferCheckedInstruction,
} from "./Protocol/Protocol.ts"
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
        const lifetimeConstraint = yield* getLatestBlockhash

        const mintAsset = yield* S.decodeUnknownEffect(SolanaAsset.SolanaAsset)(accepted.asset)
        const { mint, tokenProgram, feePayerAddress, authority } = yield* Effect.all({
          mint: S.decodeEffect(SvmAddress)(mintAsset),
          tokenProgram: S.decodeEffect(SvmAddress)(tokenProgramId),
          feePayerAddress: S.decodeEffect(SvmAddress)(feePayer),
          authority: S.decodeEffect(SvmAddress)(signer.address),
        })

        const [[sourceAta], [destAta]] = yield* Effect.all([
          findAssociatedTokenPda({ owner: authority, tokenProgram, mint }),
          S.decodeEffect(SvmAddress)(accepted.payTo).pipe(
            Effect.flatMap((owner) => findAssociatedTokenPda({ owner, tokenProgram, mint })),
          ),
        ])

        const message = buildTransactionMessage({
          feePayer: feePayerAddress,
          lifetimeConstraint,
          instructions: [
            yield* getSetComputeUnitLimitInstruction(20000),
            yield* getSetComputeUnitPriceInstruction(1n),
            yield* getTransferCheckedInstruction({
              source: sourceAta,
              mint,
              destination: destAta,
              authority,
              tokenProgram,
              amount: BigInt(accepted.amount),
              decimals: physical.decimals,
            }),
            getAddMemoInstruction(memo ?? Encoding.encodeHex(Random.bytes(16))),
          ],
        })

        const transaction = yield* compileTransaction(message).pipe(
          Effect.flatMap(signer.signTransaction),
          Effect.flatMap(getBase64EncodedWireTransaction),
        )

        return { transaction }
      },
      Effect.mapError((cause) => new Scheme.CreatePayloadError({ cause })),
    ),
)
