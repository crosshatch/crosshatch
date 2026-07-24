import { Effect, Option, pipe, Schema as S } from "effect"
import { Headers, HttpRouter, HttpServerRequest } from "effect/unstable/http"

import { Siwx } from "./Extension.ts"
import { Identity } from "./Identity.ts"
import { ProofFromBase64JsonString } from "./Schema.ts"
import * as Verification from "./Verification.ts"
import type { Verifier } from "./Verifier.ts"

export const layerMiddleware = <const Verifiers extends ReadonlyArray<Verifier>>({
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
          const requestUrl = Option.fromNullishOr(URL.parse(request.url, origin))

          const proof = yield* pipe(
            Option.fromNullishOr(Siwx.header),
            Option.flatMap((header) => Headers.get(header)(request.headers)),
            Option.map(S.decodeUnknownEffect(ProofFromBase64JsonString)),
            Effect.transposeOption,
            Effect.catchTag("SchemaError", () => Effect.succeed(Option.none())),
          )

          const identity = yield* pipe(
            Option.all({ proof, requestUrl }),
            Option.map(({ proof, requestUrl }) => Verification.verifyProof(...verifiers)(proof, requestUrl)),
            Effect.transposeOption,
            Effect.catchTag("VerifyError", () => Effect.succeed(Option.none())),
          )

          return yield* effect.pipe(
            Effect.provideService(Identity, Option.getOrUndefined(identity)),
            // Effect.provideService(Siwx, Option.getOrUndefined(proof)),
          )
        })
    }),
    { global: true },
  )
