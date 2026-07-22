import { Effect, Schema as S } from "effect"
import { FetchHttpClient, HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http"

import { Blockhash, SvmProtocolError } from "./Address.ts"

const GetLatestBlockhashResponse = S.Struct({
  body: S.Struct({
    result: S.optional(S.Struct({ value: S.Struct({ blockhash: Blockhash, lastValidBlockHeight: S.Int }) })),
    error: S.optional(S.Unknown),
  }),
})

export const getLatestBlockhash = (url: string) =>
  Effect.flatMap(HttpClient.HttpClient, (client) =>
    HttpClient.filterStatusOk(client)
      .execute(
        HttpClientRequest.post(url).pipe(
          HttpClientRequest.bodyJsonUnsafe({ jsonrpc: "2.0", id: 1, method: "getLatestBlockhash" }),
        ),
      )
      .pipe(
        Effect.flatMap(HttpClientResponse.schemaJson(GetLatestBlockhashResponse)),
        Effect.flatMap(({ body: { result, error } }) =>
          result
            ? Effect.succeed({
                blockhash: result.value.blockhash,
                lastValidBlockHeight: BigInt(result.value.lastValidBlockHeight),
              })
            : Effect.fail(new SvmProtocolError({ message: "getLatestBlockhash returned no result", cause: error })),
        ),
        Effect.catchTags({
          SchemaError: (cause) => new SvmProtocolError({ cause, message: cause.message }),
          HttpClientError: (cause) => new SvmProtocolError({ cause, message: cause.message }),
        }),
      ),
  ).pipe(Effect.provide(FetchHttpClient.layer))
