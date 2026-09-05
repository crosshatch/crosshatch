import { type Blockhash, createSolanaRpc } from "@solana/kit"
import { Context, Effect, Layer, Data } from "effect"

export class GetLatestBlockhashError extends Data.TaggedError("GetLatestBlockhashError")<{
  readonly cause?: unknown
}> {}

export class SolanaClient extends Context.Service<
  SolanaClient,
  {
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
    Effect.sync(() => {
      const rpc = createSolanaRpc(url)
      const getLatestBlockhash = Effect.tryPromise({
        try: (abortSignal) => rpc.getLatestBlockhash().send({ abortSignal }),
        catch: (cause) => new GetLatestBlockhashError({ cause }),
      }).pipe(Effect.map((v) => v.value))
      return { getLatestBlockhash }
    }),
  )
