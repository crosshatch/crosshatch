import { getMintDecoder, TOKEN_PROGRAM_ADDRESS } from "@solana-program/token"
import { address, type Address, type Blockhash, createSolanaRpc, fetchEncodedAccount } from "@solana/kit"
import { Cache, Context, Effect, Layer, Data, Exit } from "effect"

const TOKEN_2022_PROGRAM_ADDRESS = address("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")

export class GetMintMetadataError extends Data.TaggedError("GetMintMetadataError")<{ readonly mint: Address }> {}

export class InvalidMintAccountError extends Data.TaggedError("InvalidMintAccountError") {}

export class GetGenesisHashError extends Data.TaggedError("GetGenesisHashError")<{ readonly cause: unknown }> {}

export class ProgramNotFoundError extends Data.TaggedError("ProgramNotFoundError")<{ readonly cause?: unknown }> {}

export class UnsupportedProgramError extends Data.TaggedError("UnsupportedProgramError") {}

export class SolanaNetworkMismatchError extends Data.TaggedError("SolanaNetworkMismatchError")<{
  readonly expected: string
  readonly actual: string
}> {}

export class GetLatestBlockhashError extends Data.TaggedError("GetLatestBlockhashError")<{ readonly cause: unknown }> {}

export class SolanaClient extends Context.Service<
  SolanaClient,
  {
    readonly getMintMetadata: (
      mint: Address,
      reference: string,
    ) => Effect.Effect<
      {
        readonly decimals: number
        readonly programAddress: Address
      },
      | UnsupportedProgramError
      | GetMintMetadataError
      | GetGenesisHashError
      | SolanaNetworkMismatchError
      | ProgramNotFoundError
      | InvalidMintAccountError
    >
    readonly getLatestBlockhash: Effect.Effect<
      {
        readonly blockhash: Blockhash
        readonly lastValidBlockHeight: bigint
      },
      GetLatestBlockhashError
    >
  }
>()("crosshatch/Cryptocurrency/Solana/SolanaClient") {}

const timeToLive = (exit: Exit.Exit<any, any>) => (Exit.isSuccess(exit) ? Infinity : 0)

export const layer = (url: string) =>
  Layer.effect(
    SolanaClient,
    Effect.gen(function* () {
      const rpc = createSolanaRpc(url)

      const genesis = yield* Cache.makeWith(
        () =>
          Effect.tryPromise({
            try: (abortSignal) => rpc.getGenesisHash().send({ abortSignal }),
            catch: (cause) => new GetGenesisHashError({ cause }),
          }).pipe(
            Effect.map((v) => v.slice(0, 32)),
            Effect.withSpan("SolanaClient.getGenesisHash"),
          ),
        { capacity: 1, timeToLive },
      )

      const mints = yield* Cache.makeWith(
        Effect.fnUntraced(function* (mint: Address) {
          const { programAddress, data, executable } = yield* Effect.tryPromise({
            try: (abortSignal) => fetchEncodedAccount(rpc, mint, { commitment: "confirmed", abortSignal }),
            catch: (cause) => new ProgramNotFoundError({ cause }),
          }).pipe(
            Effect.filterOrFail((v) => v.exists),
            Effect.mapError(() => new ProgramNotFoundError({})),
          )
          if (programAddress !== TOKEN_PROGRAM_ADDRESS && programAddress !== TOKEN_2022_PROGRAM_ADDRESS) {
            return yield* new UnsupportedProgramError()
          }
          if (
            data.length !== 82 &&
            (programAddress !== TOKEN_2022_PROGRAM_ADDRESS || data.length < 166 || data[165] !== 1)
          ) {
            return yield* new GetMintMetadataError({ mint })
          }
          const decoded = getMintDecoder().decode(data.subarray(0, 82))
          if (!decoded.isInitialized || executable) return yield* new InvalidMintAccountError()
          return {
            decimals: decoded.decimals,
            programAddress,
          }
        }),
        { capacity: 1024, timeToLive },
      )

      const getMintMetadata = Effect.fnUntraced(function* (mint: Address, expected: string) {
        const actual = yield* Cache.get(genesis, undefined)
        if (expected !== actual) {
          return yield* new SolanaNetworkMismatchError({ expected, actual })
        }
        return yield* Cache.get(mints, mint)
      })

      const getLatestBlockhash = Effect.tryPromise({
        try: (abortSignal) => rpc.getLatestBlockhash({ commitment: "confirmed" }).send({ abortSignal }),
        catch: (cause) => new GetLatestBlockhashError({ cause }),
      }).pipe(Effect.map((v) => v.value))

      return { getLatestBlockhash, getMintMetadata }
    }),
  )
