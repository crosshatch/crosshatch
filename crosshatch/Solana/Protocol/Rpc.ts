import { Effect, Schema as S } from "effect"
import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http"

import { Blockhash } from "./Address.ts"

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

export const getLatestBlockhash = (url: string) =>
  HttpClientRequest.post(url).pipe(
    HttpClientRequest.bodyJsonUnsafe({ jsonrpc: "2.0", id: 1, method: "getLatestBlockhash" }),
    HttpClient.execute,
    Effect.flatMap(HttpClientResponse.schemaJson(GetLatestBlockhashResponse)),
    Effect.map(
      ({
        body: {
          result: {
            value: { blockhash, lastValidBlockHeight },
          },
        },
      }) => ({
        blockhash,
        lastValidBlockHeight: BigInt(lastValidBlockHeight),
      }),
    ),
    Effect.provide(FetchHttpClient.layer),
  )
