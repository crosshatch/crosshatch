import { Effect, Layer, Schema as S } from "effect"

import * as State from "../State.ts"
import { Blockhash } from "./Protocol/Protocol.ts"

export class SolanaState extends State.Service<SolanaState, Blockhash>()("crosshatch/Solana/SolanaState") {}

const GetLatestBlockhashResult = S.Struct({
  result: S.Struct({
    value: S.Struct({
      blockhash: Blockhash,
      lastValidBlockHeight: S.Int,
    }),
  }),
})

export const layer = (url: string) =>
  Layer.effect(
    SolanaState,
    Effect.sync(() => {
      const getLatestBlockhash = Effect.tryPromise({
        try: (abortSignal) =>
          fetch(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getLatestBlockhash" }),
            signal: abortSignal,
          }).then((response) => response.json()),
        catch: (cause) => new State.GetLatestBlockhashError({ cause }),
      }).pipe(
        Effect.flatMap((response) =>
          S.decodeUnknownEffect(GetLatestBlockhashResult)(response).pipe(
            Effect.map(({ result: { value } }) => ({
              blockhash: value.blockhash,
              lastValidBlockHeight: BigInt(value.lastValidBlockHeight),
            })),
            Effect.mapError((cause) => new State.GetLatestBlockhashError({ cause })),
          ),
        ),
      )
      return { getLatestBlockhash }
    }),
  )
