import { Effect, Schema as S } from "effect"
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http"

import { Blockhash } from "./Address.ts"
import type { LifetimeConstraint } from "./TransactionMessage.ts"

const GetLatestBlockhashResponse = S.Struct({
  body: S.Struct({
    result: S.Struct({
      value: S.Struct({
        blockhash: Blockhash,
        lastValidBlockHeight: S.Int,
      }),
    }),
  }),
})

export const getLatestBlockhash = HttpClientRequest.post("/").pipe(
  HttpClientRequest.bodyJsonUnsafe({ jsonrpc: "2.0", id: 1, method: "getLatestBlockhash" }),
  HttpClient.execute,
  Effect.flatMap(HttpClientResponse.schemaJson(GetLatestBlockhashResponse)),
  Effect.map(
    ({
      body: {
        result: { value },
      },
    }): LifetimeConstraint => ({
      blockhash: value.blockhash,
      lastValidBlockHeight: BigInt(value.lastValidBlockHeight),
    }),
  ),
)
