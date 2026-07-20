import { Context, Effect, Option, pipe, Schema as S } from "effect"
import { Headers, HttpRouter, HttpServerRequest } from "effect/unstable/http"

import { RequiredUrl } from "../Required.ts"
import { SiwxError } from "./Error.ts"
import { Identity } from "./Identity.ts"
import { ProofFromBase64JsonString, SIGN_IN_WITH_X } from "./Schema.ts"
import * as Verification from "./Verification.ts"
import type { Verifier } from "./Verifier.ts"

export const layerMiddleware = <const Verifiers extends ReadonlyArray<Verifier.Any>>({
  verifiers,
  origin,
}: {
  readonly verifiers: Verifiers
  readonly origin: string
}) =>
  HttpRouter.middleware()(
    Effect.gen(function* () {
      return (effect) =>
        Effect.gen(function* () {
          const request = yield* HttpServerRequest.HttpServerRequest
          const requestUrl = HttpServerRequest.toURL(request).pipe(
            Option.map((incoming) => new URL(`${origin}${incoming.pathname}${incoming.search}`)),
          )
          const identity = yield* pipe(
            Option.all({ encodedProof: Headers.get(SIGN_IN_WITH_X)(request.headers), requestUrl }),
            Option.map(({ encodedProof, requestUrl }) =>
              Effect.gen(function* () {
                const proof = yield* S.decodeUnknownEffect(ProofFromBase64JsonString)(encodedProof).pipe(
                  Effect.mapError((cause) => new SiwxError({ cause })),
                )
                return yield* Verification.verifyProof(...verifiers)(proof, requestUrl)
              }),
            ),
            Effect.transposeOption,
            Effect.map(Option.getOrUndefined),
            Effect.catchTag("SiwxError", (error) =>
              Effect.logWarning("siwx.verification.rejected").pipe(
                Effect.annotateLogs({ cause: error.cause }),
                Effect.as(undefined),
              ),
            ),
          )

          return yield* Effect.provideContext(
            effect,
            pipe(
              Context.make(Identity, identity),
              Context.add(
                RequiredUrl,
                requestUrl.pipe(
                  Option.map(({ href }) => href),
                  Option.getOrUndefined,
                ),
              ),
            ),
          )
        })
    }),
    { global: true },
  )
