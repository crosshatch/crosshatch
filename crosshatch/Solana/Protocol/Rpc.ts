import { Effect, Result, Schema as S } from "effect"
import { FetchHttpClient, HttpBody, HttpClient, HttpClientResponse } from "effect/unstable/http"

import { Blockhash } from "./Address.ts"
import { SvmProtocolError } from "./Error.ts"

export const getLatestBlockhash = (url: string) =>
  HttpClient.HttpClient.pipe(
    Effect.map(HttpClient.filterStatusOk),
    Effect.flatMap(({ post }) =>
      post(url, { body: HttpBody.jsonUnsafe({ jsonrpc: "2.0", id: 1, method: "getLatestBlockhash" }) }),
    ),
    Effect.flatMap(
      HttpClientResponse.schemaBodyJson(
        S.Struct({
          result: S.optional(S.Struct({ value: S.Struct({ blockhash: Blockhash, lastValidBlockHeight: S.Int }) })),
          error: S.optional(S.Unknown),
        }),
      ),
    ),
    Effect.filterMapOrFail(
      ({ result, error }) => (result ? Result.succeed(result.value) : Result.fail(error)),
      (cause) => new SvmProtocolError({ cause }),
    ),
    Effect.map(({ blockhash, lastValidBlockHeight }) => ({
      blockhash,
      lastValidBlockHeight: BigInt(lastValidBlockHeight),
    })),
    Effect.catchTags({
      SchemaError: (cause) => new SvmProtocolError({ cause }),
      HttpClientError: ({ cause, message }) => new SvmProtocolError({ cause, message }),
    }),
    Effect.provide(FetchHttpClient.layer),
  )
