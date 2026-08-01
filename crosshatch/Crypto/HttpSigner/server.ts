import { Effect, Struct, Encoding, Option, Schema as S, Context, Data, identity, pipe, flow } from "effect"
import { HttpServerRequest, Headers, HttpRouter } from "effect/unstable/http"
import { parseAcceptSignature, verify } from "http-message-sig"

import * as Ed25519PublicKey from "../Ed25519PublicKey.ts"
import { SignatureInputKey, SignatureKey } from "./constants.ts"

export class SignatureError extends Data.TaggedError("SignatureError") {}

export class HttpSigner extends Context.Service<HttpSigner, Ed25519PublicKey.Ed25519PublicKey | undefined>()(
  "crosshatch/Crypto/HttpSigner",
) {}

export const layerMiddleware = HttpRouter.middleware<{ readonly provides: HttpSigner }>()(
  (effect) =>
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      let { method, url: pathname, headers } = request
      const url = Headers.get(headers, "X-Forwarded-Host").pipe(
        Option.getOrElse(() => new URL(request.originalUrl).host),
        (v) => `https://${v}${pathname}`,
      )
      const signatureHeaders = Option.all({
        [SignatureKey]: Headers.get(headers, SignatureKey),
        [SignatureInputKey]: Headers.get(headers, SignatureInputKey),
      }).pipe(Option.getOrUndefined)
      if (!signatureHeaders) {
        return yield* effect.pipe(Effect.provideService(HttpSigner, undefined))
      }
      const publicKey = yield* pipe(
        signatureHeaders[SignatureInputKey],
        parseAcceptSignature,
        Struct.get("parameters"),
        S.decodeUnknownEffect(S.Struct({ keyid: S.String })),
        Effect.map(flow(Struct.get("keyid"), Encoding.decodeBase64Url)),
        Effect.flatMap(Effect.fromResult),
        Effect.flatMap(Ed25519PublicKey.fromBytes),
      )
      yield* Effect.promise(() =>
        verify({ headers, method, url }, (data, signature) =>
          Ed25519PublicKey.verify(publicKey, signature.slice(), new TextEncoder().encode(data)).pipe(Effect.runPromise),
        ),
      ).pipe(Effect.filterOrFail(identity, () => new SignatureError()))
      return yield* Effect.provideService(effect, HttpSigner, publicKey)
    }),
  { global: true },
)
