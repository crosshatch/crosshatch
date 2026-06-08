import { generateJwt } from "@coinbase/cdp-sdk/auth"
import { Redacted, Effect, flow, Config } from "effect"
import { HttpClient, HttpClientRequest } from "effect/unstable/http"

import * as Cdp from "./Cdp.ts"

export const make = Effect.fn(function* ({ host, path }: { readonly host: string; readonly path: string }) {
  const apiKeyId = yield* Config.string("CDP_API_KEY_ID")
  const CDP_API_KEY_SECRET = yield* Config.redacted("CDP_API_KEY_SECRET")
  const jwt = yield* Effect.promise(() =>
    generateJwt({
      apiKeyId,
      apiKeySecret: Redacted.value(CDP_API_KEY_SECRET),
      expiresIn: 60 * 60 * 24,
      requestHost: host,
      requestMethod: "POST",
      requestPath: path,
    }),
  )
  return Cdp.make(yield* HttpClient.HttpClient, {
    transformClient: (client) =>
      Effect.succeed(
        client.pipe(
          HttpClient.mapRequest(
            flow(
              HttpClientRequest.prependUrl(`https://${host}/platform`),
              HttpClientRequest.setHeader("Authorization", `Bearer ${jwt}`),
            ),
          ),
        ),
      ),
  })
})
