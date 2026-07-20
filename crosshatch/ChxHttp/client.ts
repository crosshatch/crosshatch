import { Effect, Layer, Schema as S } from "effect"
import { HttpClient, HttpClientError, HttpClientRequest } from "effect/unstable/http"

import { RequiredFromBase64JsonString } from "../Required.ts"
import { CROSSHATCH_TRACE_ID, PAYMENT_REQUIRED } from "./constants.ts"
import type { Resolver } from "./Resolver.ts"

export function layerClient<const Resolvers extends ReadonlyArray<Resolver.Any>>(
  ...resolvers: Resolvers
): Layer.Layer<HttpClient.HttpClient, never, HttpClient.HttpClient | Resolver.Context<Resolvers[number]>>

export function layerClient<R>(...resolvers: ReadonlyArray<Resolver<unknown, R>>) {
  return Layer.effect(
    HttpClient.HttpClient,
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient
      const context = yield* Effect.context<R>()
      return HttpClient.transform(client, (effect, request) =>
        Effect.gen(function* () {
          const response = yield* effect
          if (response.status !== 402) {
            return response
          }
          const requiredHeader = response.headers[PAYMENT_REQUIRED]
          if (requiredHeader === undefined) {
            return yield* new HttpClientError.HttpClientError({
              reason: new HttpClientError.DecodeError({
                request: response.request,
                response,
                description: `Missing ${PAYMENT_REQUIRED} header`,
              }),
            })
          }
          const required = yield* S.decodeUnknownEffect(RequiredFromBase64JsonString)(requiredHeader).pipe(
            Effect.mapError(
              (cause) =>
                new HttpClientError.HttpClientError({
                  reason: new HttpClientError.DecodeError({ request: response.request, response, cause }),
                }),
            ),
          )
          let resolved = false
          for (const resolver of resolvers) {
            const resolution = yield* resolver({
              request,
              required,
              traceId: response.headers[CROSSHATCH_TRACE_ID],
            }).pipe(
              Effect.provide(context),
              Effect.mapError(
                // oxlint-disable-next-line no-loop-func
                (cause) =>
                  new HttpClientError.HttpClientError({
                    reason: new HttpClientError.EncodeError({ request, cause }),
                  }),
              ),
            )
            if (resolution === undefined) {
              continue
            }
            request = HttpClientRequest.setHeaders(request, new Headers(resolution.headers))
            resolved = true
          }
          return resolved ? yield* client.execute(request) : response
        }),
      )
    }),
  )
}
