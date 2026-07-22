import { Effect, Schema as S } from "effect"
import { FetchHttpClient, HttpBody, HttpClient, HttpClientResponse } from "effect/unstable/http"

import { Blockhash } from "./Address.ts"
import { SvmProtocolError } from "./Error.ts"

export const getLatestBlockhash = Effect.fn("getLatestBlockhash")(
  function* (url: string) {
    const client = (yield* HttpClient.HttpClient).pipe(HttpClient.filterStatusOk)

    const { result, error } = yield* client
      .post(url, { body: HttpBody.jsonUnsafe({ jsonrpc: "2.0", id: 1, method: "getLatestBlockhash" }) })
      .pipe(
        Effect.flatMap(
          HttpClientResponse.schemaBodyJson(
            S.Struct({
              result: S.optional(S.Struct({ value: S.Struct({ blockhash: Blockhash, lastValidBlockHeight: S.Int }) })),
              error: S.optional(S.Unknown),
            }),
          ),
        ),
      )

    if (!result) {
      return yield* new SvmProtocolError({ message: "getLatestBlockhash returned no result", cause: error })
    }
    return {
      blockhash: result.value.blockhash,
      lastValidBlockHeight: BigInt(result.value.lastValidBlockHeight),
    }
  },
  Effect.catchTags({
    SchemaError: (cause) => new SvmProtocolError({ cause, message: cause.message }),
    HttpClientError: (cause) => new SvmProtocolError({ cause, message: cause.message }),
  }),
  Effect.provide(FetchHttpClient.layer),
)
