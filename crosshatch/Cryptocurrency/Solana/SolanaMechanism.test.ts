import { assert, describe, it } from "@effect/vitest"
import type * as Token from "@solana-program/token"
import { findAssociatedTokenPda, getTransferCheckedInstruction } from "@solana-program/token"
import { address, blockhash, type Base64EncodedWireTransaction, type TransactionPartialSigner } from "@solana/kit"
import { Crypto, Effect, Schema } from "effect"
import { vi } from "vitest"

import type * as Index from "../../index.ts"
import { MakePayloadError, type MakePayload } from "../../Mechanism.ts"
import { Network } from "../../Network.ts"
import { Requirements } from "../../Requirements.ts"
import { SolanaClient } from "./SolanaClient.ts"
import { SolanaMechanism, Extra } from "./SolanaMechanism.ts"
import { SolanaSigner } from "./SolanaSigner.ts"

type MakePayloadBody = MakePayload<
  typeof Extra.Type,
  { readonly transaction: Base64EncodedWireTransaction },
  SolanaClient | SolanaSigner | Crypto.Crypto
>
const captured = vi.hoisted(() => ({
  makePayload: undefined as MakePayloadBody | undefined,
  events: [] as Array<string>,
}))
// Avoid evaluating unrelated unfinished modules re-exported by the package barrel.
vi.mock<typeof Index>(import("../../index.ts"), async () => ({
  Mechanism: await import("../../Mechanism.ts"),
}))
vi.mock<typeof Token>(import("@solana-program/token"), async (original) => {
  const token = await original()
  return {
    ...token,
    findAssociatedTokenPda: vi.fn<typeof Token.findAssociatedTokenPda>((...args) => {
      captured.events.push("ata")
      return token.findAssociatedTokenPda(...args)
    }),
    getTransferCheckedInstruction: vi.fn<typeof Token.getTransferCheckedInstruction>((...args) => {
      captured.events.push("transfer")
      return token.getTransferCheckedInstruction(...args)
    }) as typeof Token.getTransferCheckedInstruction,
  }
})

const mint = address("So11111111111111111111111111111111111111112")
const authority = address("11111111111111111111111111111111")
const payTo = address("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
const programs = [
  address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"),
]
const network = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
const amount = "9007199254740993"
const input = Effect.gen(function* () {
  return {
    accepted: Requirements.make({
      amount,
      asset: mint,
      payTo,
      network: yield* Schema.decodeEffect(Network)({ family: "solana", reference: network }),
      maxTimeoutSeconds: 60,
      scheme: "exact",
    }),
    extra: yield* Schema.decodeEffect(Extra)({ feePayer: authority }),
  }
})
const crypto = Crypto.make({
  randomBytes: (size) => {
    captured.events.push("memo")
    return new Uint8Array(size)
  },
  digest: (_algorithm, data) => Effect.succeed(data),
})

// oxlint-disable-next-line jest/valid-describe-callback -- Vitest supports options before the callback.
describe("solana mechanism", { concurrent: false }, () => {
  it.effect("uses fetched metadata and exact atomic amounts with a fresh late blockhash for every signing", () =>
    Effect.gen(function* () {
      assert.isDefined(captured.makePayload)
      assert.strictEqual(SolanaMechanism.key, "crosshatch/Cryptocurrency/Solana/SolanaMechanism")
      const args = yield* input
      for (const tokenProgram of programs) {
        vi.clearAllMocks()
        captured.events.length = 0
        const hashes = [blockhash(mint), blockhash(payTo)]
        let requests = 0
        const signTransactions = vi.fn<TransactionPartialSigner["signTransactions"]>((transactions) => {
          captured.events.push("sign")
          assert.deepStrictEqual(transactions[0]?.lifetimeConstraint, {
            blockhash: hashes[requests - 1]!,
            lastValidBlockHeight: 123n,
          })
          return Promise.resolve(transactions.map(() => ({})))
        })
        const client = SolanaClient.of({
          getMintMetadata: (requestedMint, reference) =>
            Effect.sync(() => {
              captured.events.push("metadata")
              assert.strictEqual(requestedMint, mint)
              assert.strictEqual(reference, network)
              return { decimals: 9, programAddress: tokenProgram }
            }),
          getLatestBlockhash: Effect.sync(() => {
            captured.events.push("blockhash")
            return { blockhash: hashes[requests++]!, lastValidBlockHeight: 123n }
          }),
        })
        for (let i = 0; i < 2; i++) {
          const result = yield* captured
            .makePayload(args.accepted, args.extra)
            .pipe(
              Effect.provideService(SolanaClient, client),
              Effect.provideService(SolanaSigner, { address: authority, signTransactions }),
            )
          assert.isString(result.transaction)
        }
        assert.deepStrictEqual(
          captured.events,
          Array.from({ length: 2 }, () => ["metadata", "ata", "ata", "transfer", "memo", "blockhash", "sign"]).flat(),
        )
        const ataCalls = vi.mocked(findAssociatedTokenPda).mock.calls
        assert.deepStrictEqual(
          ataCalls.map(([value]) => value),
          [authority, payTo, authority, payTo].map((owner) => ({ owner, mint, tokenProgram })),
        )
        for (const [instruction, config] of vi.mocked(getTransferCheckedInstruction).mock.calls) {
          assert.strictEqual(instruction.decimals, 9)
          assert.strictEqual(instruction.amount, 9007199254740993n)
          assert.strictEqual(config?.programAddress, tokenProgram)
        }
        assert.strictEqual(requests, 2)
      }
    }).pipe(Effect.provideService(Crypto.Crypto, crypto)),
  )

  it.effect("returns signing failures in the typed payload error channel", () =>
    Effect.gen(function* () {
      assert.isDefined(captured.makePayload)
      const cause = new Error("signing rejected")
      const args = yield* input
      const failure = yield* captured.makePayload(args.accepted, args.extra).pipe(
        Effect.provideService(SolanaClient, {
          getMintMetadata: () => Effect.succeed({ decimals: 6, programAddress: programs[0]! }),
          getLatestBlockhash: Effect.succeed({ blockhash: blockhash(mint), lastValidBlockHeight: 123n }),
        }),
        Effect.provideService(SolanaSigner, { address: authority, signTransactions: () => Promise.reject(cause) }),
        Effect.flip,
      )
      assert.instanceOf(failure, MakePayloadError)
      assert.instanceOf(failure.cause, Error)
      assert.strictEqual(failure.cause.cause, cause)
    }).pipe(Effect.provideService(Crypto.Crypto, crypto)),
  )
})
