/* oxlint-disable vitest/prefer-called-once -- Conflicts with the enabled prefer-called-times rule. */
import { describe, expect, it } from "@effect/vitest"
import type * as Kit from "@solana/kit"
import { address, type Address } from "@solana/kit"
import { Deferred, Effect, Exit, Fiber } from "effect"
import { vi } from "vitest"

import { layer, SolanaClient } from "./SolanaClient.ts"

const mocks = vi.hoisted(() => ({
  account: vi.fn<(...args: ReadonlyArray<unknown>) => Promise<unknown>>(),
  genesis: vi.fn<() => Promise<string>>(),
  blockhash: vi.fn<(...args: ReadonlyArray<unknown>) => Promise<unknown>>(),
}))
vi.mock<typeof Kit>(import("@solana/kit"), async (original) => ({
  ...(await original()),
  fetchEncodedAccount: mocks.account as typeof Kit.fetchEncodedAccount,
  createSolanaRpc: (() => ({
    getGenesisHash: () => ({ send: mocks.genesis }),
    getLatestBlockhash: (config: unknown) => ({ send: (options: unknown) => mocks.blockhash(config, options) }),
  })) as unknown as typeof Kit.createSolanaRpc,
}))

const mint = address("So11111111111111111111111111111111111111112")
const legacy = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
const token2022 = address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
const genesis = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d"
const network = genesis.slice(0, 32)
const account = (programAddress: Address = legacy, length = 82) => {
  const data = new Uint8Array(length)
  data[44] = 6
  data[45] = 1
  if (length > 165) data[165] = 1
  return { exists: true, executable: false, programAddress, data }
}

const setup = () => {
  vi.resetAllMocks()
  mocks.genesis.mockResolvedValue(genesis)
  mocks.account.mockResolvedValue(account())
  mocks.blockhash.mockResolvedValue({ value: { blockhash: genesis, lastValidBlockHeight: 123n } })
}

// oxlint-disable-next-line jest/valid-describe-callback -- Vitest supports options before the callback.
describe("solana client", { concurrent: false }, () => {
  it.effect("deduplicates concurrent metadata and genesis lookups", () =>
    Effect.gen(function* () {
      setup()
      const client = yield* SolanaClient
      const values = yield* Effect.all(
        Array.from({ length: 10 }, () => client.getMintMetadata(mint, network)),
        { concurrency: "unbounded" },
      )
      expect(values).toStrictEqual(Array.from({ length: 10 }, () => ({ decimals: 6, tokenProgram: legacy })))
      yield* client.getMintMetadata(mint, network)
      expect(mocks.account).toHaveBeenCalledTimes(1)
      expect(mocks.genesis).toHaveBeenCalledTimes(1)
      expect(mocks.account.mock.calls[0]?.[2]).toHaveProperty("commitment", "confirmed")
      expect(mocks.account.mock.calls[0]?.[2]).toHaveProperty("abortSignal")
    }).pipe(Effect.provide(layer("http://localhost:8899"))),
  )

  it.effect("decodes an extended Token-2022 mint", () =>
    Effect.gen(function* () {
      setup()
      mocks.account.mockResolvedValue(account(token2022, 170))
      const client = yield* SolanaClient
      expect(yield* client.getMintMetadata(mint, network)).toStrictEqual({ decimals: 6, tokenProgram: token2022 })
    }).pipe(Effect.provide(layer("http://localhost:8899"))),
  )

  it.effect("isolates cached metadata by mint and client", () =>
    Effect.gen(function* () {
      setup()
      const client = yield* SolanaClient
      yield* client.getMintMetadata(mint, network)
      yield* client.getMintMetadata(legacy, network)
      yield* Effect.gen(function* () {
        const other = yield* SolanaClient
        yield* other.getMintMetadata(mint, network)
      }).pipe(Effect.provide(layer("http://localhost:8900")))
      expect(mocks.account).toHaveBeenCalledTimes(3)
      expect(mocks.genesis).toHaveBeenCalledTimes(2)
    }).pipe(Effect.provide(layer("http://localhost:8899"))),
  )

  it.effect("retries failed metadata and genesis requests", () =>
    Effect.gen(function* () {
      setup()
      mocks.genesis.mockRejectedValueOnce(new Error("offline"))
      mocks.account.mockRejectedValueOnce(new Error("offline"))
      const client = yield* SolanaClient
      expect((yield* Effect.flip(client.getMintMetadata(mint, network)))._tag).toBe("GetGenesisHashError")
      expect((yield* Effect.flip(client.getMintMetadata(mint, network)))._tag).toBe("GetMintMetadataError")
      yield* client.getMintMetadata(mint, network)
      expect(mocks.genesis).toHaveBeenCalledTimes(2)
      expect(mocks.account).toHaveBeenCalledTimes(2)
    }).pipe(Effect.provide(layer("http://localhost:8899"))),
  )

  it.effect("checks every accepted network even on cache hits", () =>
    Effect.gen(function* () {
      setup()
      const client = yield* SolanaClient
      yield* client.getMintMetadata(mint, network)
      expect((yield* Effect.flip(client.getMintMetadata(mint, "wrong")))._tag).toBe("SolanaNetworkMismatchError")
      expect(mocks.account).toHaveBeenCalledTimes(1)
      expect(mocks.genesis).toHaveBeenCalledTimes(1)
    }).pipe(Effect.provide(layer("http://localhost:8899"))),
  )

  it.effect("rejects missing, unsupported, malformed, and uninitialized accounts", () =>
    Effect.gen(function* () {
      setup()
      const client = yield* SolanaClient
      const uninitialized = account()
      uninitialized.data[45] = 0
      const wrongType = account(token2022, 166)
      wrongType.data[165] = 2
      for (const value of [
        { exists: false },
        account(mint),
        account(legacy, 165),
        account(token2022, 12),
        wrongType,
        uninitialized,
      ]) {
        mocks.account.mockResolvedValueOnce(value)
        expect((yield* Effect.flip(client.getMintMetadata(mint, network)))._tag).toBe("GetMintMetadataError")
      }
    }).pipe(Effect.provide(layer("http://localhost:8899"))),
  )

  it.effect("does not cache blockhashes and explicitly requests confirmed", () =>
    Effect.gen(function* () {
      setup()
      const client = yield* SolanaClient
      yield* client.getLatestBlockhash
      yield* client.getLatestBlockhash
      expect(mocks.blockhash).toHaveBeenCalledTimes(2)
      expect(mocks.blockhash.mock.calls[0]?.[0]).toStrictEqual({ commitment: "confirmed" })
      expect(mocks.blockhash.mock.calls[0]?.[1]).toHaveProperty("abortSignal")
      mocks.blockhash.mockRejectedValueOnce(new Error("offline"))
      expect((yield* Effect.flip(client.getLatestBlockhash))._tag).toBe("GetLatestBlockhashError")
    }).pipe(Effect.provide(layer("http://localhost:8899"))),
  )

  it.effect("aborts interrupted fetches and allows a subsequent retry", () =>
    Effect.gen(function* () {
      setup()
      const started = yield* Deferred.make<AbortSignal>()
      mocks.account.mockImplementationOnce((_rpc, _mint, config) => {
        const { abortSignal } = config as { readonly abortSignal: AbortSignal }
        Deferred.doneUnsafe(started, Exit.succeed(abortSignal))
        return Promise.withResolvers<unknown>().promise
      })
      const client = yield* SolanaClient
      const fiber = yield* client.getMintMetadata(mint, network).pipe(Effect.forkChild)
      const signal = yield* Deferred.await(started)
      yield* Effect.yieldNow
      yield* Fiber.interrupt(fiber)
      expect(signal.aborted).toBeTruthy()
      yield* client.getMintMetadata(mint, network)
      expect(mocks.account).toHaveBeenCalledTimes(2)
    }).pipe(Effect.provide(layer("http://localhost:8899"))),
  )
})
