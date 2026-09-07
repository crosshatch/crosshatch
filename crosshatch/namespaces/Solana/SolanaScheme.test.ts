import { assert, describe, it } from "@effect/vitest"
import type * as Token from "@solana-program/token"
import { findAssociatedTokenPda, getTransferCheckedInstruction } from "@solana-program/token"
import { address, blockhash, type Base64EncodedWireTransaction, type TransactionPartialSigner } from "@solana/kit"
import { Context, Crypto, Effect, Layer, Schema } from "effect"
import { vi } from "vitest"

import { AdaptError, type Adapt } from "../../Adapt.ts"
import * as Address from "../../Address.ts"
import { ChainFromString } from "../../Chain.ts"
import type * as Index from "../../index.ts"
import { make as makeRequirements, Requirements } from "../../Requirements.ts"
import type * as Scheme from "../../Scheme.ts"
import { SolanaClient } from "./SolanaClient.ts"
import { SolanaScheme, type Extra } from "./SolanaScheme.ts"
import { SolanaSigner } from "./SolanaSigner.ts"

type AdaptBody = Adapt<
  typeof Extra.Type,
  { readonly transaction: Base64EncodedWireTransaction },
  SolanaClient | SolanaSigner | Crypto.Crypto
>
const captured = vi.hoisted(() => ({ adapt: undefined as AdaptBody | undefined, events: [] as Array<string> }))
// Avoid evaluating unrelated unfinished modules re-exported by the package barrel.
vi.mock<typeof Index>(import("../../index.ts"), async () => ({
  Address: await import("../../Address.ts"),
  Adapt: await import("../../Adapt.ts"),
  Scheme: await import("../../Scheme.ts"),
}))
vi.mock<typeof Scheme>(import("../../Scheme.ts"), () => ({
  Service: (() => (id: string) =>
    class extends Context.Service<never, never>()(id) {
      static layer(_extra: unknown, adapt: AdaptBody) {
        captured.adapt = adapt
        return Layer.empty
      }
    }) as unknown as typeof Scheme.Service,
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
    accepted: yield* Schema.decodeEffect(Requirements)({
      amount,
      asset: mint,
      payTo,
      network: `solana:${network}`,
      maxTimeoutSeconds: 60,
      scheme: "exact",
    }),
    extra: { feePayer: yield* Address.make(authority) },
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
describe("solana adaptation", { concurrent: false }, () => {
  it.effect("uses fetched metadata and exact atomic amounts with a fresh late blockhash for every signing", () =>
    Effect.gen(function* () {
      assert.isDefined(captured.adapt)
      assert.strictEqual(SolanaScheme.key, "crosshatch/namespaces/Solana/SolanaScheme")
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
              return { decimals: 9, tokenProgram }
            }),
          getLatestBlockhash: Effect.sync(() => {
            captured.events.push("blockhash")
            return { blockhash: hashes[requests++]!, lastValidBlockHeight: 123n }
          }),
        })
        for (let i = 0; i < 2; i++) {
          const result = yield* captured
            .adapt(args)
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

  it.effect("returns signing failures in the typed adaptation error channel", () =>
    Effect.gen(function* () {
      assert.isDefined(captured.adapt)
      const cause = new Error("signing rejected")
      const args = yield* input
      const failure = yield* captured.adapt(args).pipe(
        Effect.provideService(SolanaClient, {
          getMintMetadata: () => Effect.succeed({ decimals: 6, tokenProgram: programs[0]! }),
          getLatestBlockhash: Effect.succeed({ blockhash: blockhash(mint), lastValidBlockHeight: 123n }),
        }),
        Effect.provideService(SolanaSigner, { address: authority, signTransactions: () => Promise.reject(cause) }),
        Effect.flip,
      )
      assert.instanceOf(failure, AdaptError)
      assert.strictEqual(failure.cause, cause)
    }).pipe(Effect.provideService(Crypto.Crypto, crypto)),
  )

  it.effect("rejects other namespaces before looking up metadata or signing", () =>
    Effect.gen(function* () {
      assert.isDefined(captured.adapt)
      const args = yield* input
      const wrongNetwork = yield* Schema.decodeEffect(ChainFromString)(`other:${network}`)
      const metadata = vi.fn<() => Effect.Effect<{ readonly decimals: number; readonly tokenProgram: typeof mint }>>(
        () => Effect.succeed({ decimals: 6, tokenProgram: programs[0]! }),
      )
      const signTransactions = vi.fn<TransactionPartialSigner["signTransactions"]>(() => Promise.resolve([]))
      const failure = yield* captured
        .adapt({
          ...args,
          accepted: makeRequirements({ ...args.accepted, network: wrongNetwork }),
        })
        .pipe(
          Effect.provideService(SolanaClient, {
            getMintMetadata: metadata,
            getLatestBlockhash: Effect.succeed({ blockhash: blockhash(mint), lastValidBlockHeight: 123n }),
          }),
          Effect.provideService(SolanaSigner, { address: authority, signTransactions }),
          Effect.flip,
        )
      assert.instanceOf(failure, AdaptError)
      assert.strictEqual(metadata.mock.calls.length, 0)
      assert.strictEqual(signTransactions.mock.calls.length, 0)
    }).pipe(Effect.provideService(Crypto.Crypto, crypto)),
  )
})
