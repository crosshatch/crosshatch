import { Effect, Encoding, flow, Schema as S } from "effect"

import { Random } from "../Crypto/Crypto.ts"
import * as Scheme from "../Scheme.ts"
import {
  SolanaProtocolAddress,
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

        const mint = yield* S.decodeUnknownEffect(SolanaAsset.SolanaAsset)(accepted.asset)

        const [[source], [destination]] = yield* Effect.all([
          findAssociatedTokenPda({ owner: signer.address, tokenProgram: tokenProgramId, mint }),
          flow(
            S.decodeEffect(SolanaProtocolAddress),
            Effect.flatMap((owner) => findAssociatedTokenPda({ owner, tokenProgram: tokenProgramId, mint })),
          )(accepted.payTo),
        ])

        const message = yield* Effect.all([
          getSetComputeUnitLimitInstruction(20000),
          getSetComputeUnitPriceInstruction(1n),
          getTransferCheckedInstruction({
            source,
            mint,
            destination,
            authority: signer.address,
            tokenProgram: tokenProgramId,
            amount: BigInt(accepted.amount),
            decimals: physical.decimals,
          }),
          Effect.succeed(getAddMemoInstruction(memo ?? Encoding.encodeHex(Random.bytes(16)))),
        ]).pipe(Effect.map((instructions) => buildTransactionMessage({ feePayer, lifetimeConstraint, instructions })))

        const transaction = yield* compileTransaction(message).pipe(
          Effect.flatMap(signer.signTransaction),
          Effect.flatMap(getBase64EncodedWireTransaction),
        )

        return { transaction }
      },
      Effect.mapError((cause) => new Scheme.CreatePayloadError({ cause })),
    ),
)
