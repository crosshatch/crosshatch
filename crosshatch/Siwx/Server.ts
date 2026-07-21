import { Effect, Option, pipe, Schema as S } from "effect"
import { Headers, HttpRouter, HttpServerRequest } from "effect/unstable/http"

import { RequiredUrl } from "../Required.ts"
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
          const requestUrl = Option.liftThrowable((url: string) => new URL(url, origin))(request.url)

          const identity = yield* pipe(
            Option.all({ encodedProof: Headers.get(SIGN_IN_WITH_X)(request.headers), requestUrl }),
            Option.map(({ encodedProof, requestUrl }) =>
              S.decodeUnknownEffect(ProofFromBase64JsonString)(encodedProof).pipe(
                Effect.flatMap((proof) => Verification.verifyProof(...verifiers)(proof, requestUrl)),
              ),
            ),
            Effect.transposeOption,
            Effect.map(Option.getOrUndefined),
          )

          return yield* effect.pipe(
            Effect.provideService(Identity, identity),
            Effect.provideService(
              RequiredUrl,
              requestUrl.pipe(
                Option.map(({ href }) => href),
                Option.getOrUndefined,
              ),
            ),
          )
        })
    }),
    { global: true },
  )
