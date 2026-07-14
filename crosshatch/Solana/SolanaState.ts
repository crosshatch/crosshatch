import { type Blockhash, createSolanaRpc } from "@solana/kit"
import { Effect, Layer } from "effect"

import * as State from "../State.ts"

export class SolanaState extends State.Service<SolanaState, Blockhash>()("crosshatch/Solana/SolanaState") {}

export const layer = (url: string) =>
  Layer.effect(
    SolanaState,
    Effect.sync(() => {
      const rpc = createSolanaRpc(url)
      const getLatestBlockhash = Effect.tryPromise({
        try: (abortSignal) => rpc.getLatestBlockhash().send({ abortSignal }),
        catch: (cause) => new State.GetLatestBlockhashError({ cause }),
      }).pipe(Effect.map(({ value }) => value))
      return { getLatestBlockhash }
    }),
  )
