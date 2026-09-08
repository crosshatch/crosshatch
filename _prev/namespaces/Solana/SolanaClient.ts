import { getMintDecoder, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token"
import { address, type Address, type Blockhash, createSolanaRpc, fetchEncodedAccount } from "@solana/kit"
import { Cache, Context, Effect, Layer, Data, Exit } from "effect"

const TOKEN_2022_PROGRAM_ADDRESS = address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")

export interface MintMetadata {
  readonly decimals: number
  readonly tokenProgram: Address
}

export class GetMintMetadataError extends Data.TaggedError("GetMintMetadataError")<{
  readonly mint: Address
  readonly cause?: unknown
}> {}

export class GetGenesisHashError extends Data.TaggedError("GetGenesisHashError")<{
  readonly cause?: unknown
}> {}

export class SolanaNetworkMismatchError extends Data.TaggedError("SolanaNetworkMismatchError")<{
  readonly expected: string
  readonly actual: string
}> {}

export class GetLatestBlockhashError extends Data.TaggedError("GetLatestBlockhashError")<{
  readonly cause?: unknown
}> {}

export class SolanaClient extends Context.Service<
  SolanaClient,
  {
    readonly getMintMetadata: (
      mint: Address,
      networkReference: string,
    ) => Effect.Effect<MintMetadata, GetMintMetadataError | GetGenesisHashError | SolanaNetworkMismatchError>
    readonly getLatestBlockhash: Effect.Effect<
      {
        readonly blockhash: Blockhash
        readonly lastValidBlockHeight: bigint
      },
      GetLatestBlockhashError
    >
  }
>()("crosshatch/namespaces/Solana/SolanaClient") {}

export const layer = (url: string) =>
  Layer.effect(
    SolanaClient,
    Effect.gen(function* () {
      const rpc = createSolanaRpc(url)
      const genesis = yield* Cache.makeWith(
        (_: void) =>
          Effect.tryPromise({
            try: (abortSignal) => rpc.getGenesisHash().send({ abortSignal }),
            catch: (cause) => new GetGenesisHashError({ cause }),
          }).pipe(Effect.withSpan("SolanaClient.getGenesisHash", { kind: "client" })),
        { capacity: 1, timeToLive: (exit) => (Exit.isSuccess(exit) ? Infinity : 0) },
      )
      const mints = yield* Cache.makeWith(
        Effect.fnUntraced(function* (mint: Address) {
          const account = yield* Effect.tryPromise({
            try: (abortSignal) => fetchEncodedAccount(rpc, mint, { commitment: "confirmed", abortSignal }),
            catch: (cause) => new GetMintMetadataError({ mint, cause }),
          }).pipe(Effect.withSpan("SolanaClient.getMintAccount", { kind: "client" }))
          return yield* Effect.try({
            try: (): MintMetadata => {
              if (!account.exists) throw new Error("Mint account does not exist")
              const tokenProgram = account.programAddress
              if (tokenProgram !== TOKEN_PROGRAM_ADDRESS && tokenProgram !== TOKEN_2022_PROGRAM_ADDRESS) {
                throw new Error(`Unsupported token program: ${tokenProgram}`)
              }
              // Token-2022 extensions follow the shared mint base, padding, and Mint account-type byte.
              const data = account.data
              if (
                data.length !== 82 &&
                (tokenProgram !== TOKEN_2022_PROGRAM_ADDRESS || data.length < 166 || data[165] !== 1)
              ) {
                throw new Error("Invalid mint account layout")
              }
              const decoded = getMintDecoder().decode(data.subarray(0, 82))
              if (!decoded.isInitialized || account.executable) throw new Error("Invalid mint account")
              return { decimals: decoded.decimals, tokenProgram }
            },
            catch: (cause) => new GetMintMetadataError({ mint, cause }),
          })
        }),
        { capacity: 1024, timeToLive: (exit) => (Exit.isSuccess(exit) ? Infinity : 0) },
      )
      const getMintMetadata = Effect.fnUntraced(function* (mint: Address, networkReference: string) {
        const hash = yield* Cache.get(genesis, undefined)
        // CAIP-2 Solana references use the first 32 characters of the genesis hash.
        const actual = hash.slice(0, 32)
        if (networkReference !== actual) {
          return yield* new SolanaNetworkMismatchError({ expected: networkReference, actual })
        }
        return yield* Cache.get(mints, mint)
      })
      const getLatestBlockhash = Effect.tryPromise({
        try: (abortSignal) => rpc.getLatestBlockhash({ commitment: "confirmed" }).send({ abortSignal }),
        catch: (cause) => new GetLatestBlockhashError({ cause }),
      }).pipe(
        Effect.map((v) => v.value),
        Effect.withSpan("SolanaClient.getLatestBlockhash", { kind: "client" }),
      )
      return { getLatestBlockhash, getMintMetadata }
    }),
  )
