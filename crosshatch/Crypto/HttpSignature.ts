import {
  Effect,
  Struct,
  Encoding,
  Ref,
  Option,
  Schema as S,
  Context,
  Data,
  identity,
  pipe,
  flow,
  Layer,
  UndefinedOr,
  SchemaIssue,
} from "effect"
import { HttpServerRequest, Headers, FetchHttpClient } from "effect/unstable/http"
import { parseAcceptSignature, verify, signatureHeaders } from "http-message-sig"

import * as CryptoKey from "./CryptoKey.ts"
import * as Ed25519Pair from "./Ed25519Pair.ts"
import * as Ed25519PrivateKey from "./Ed25519PrivateKey.ts"
import * as Ed25519PublicKey from "./Ed25519PublicKey.ts"
import * as Hash from "./Hash.ts"

export const SignatureKey = "Signature" as const
export const SignatureInputKey = "Signature-Input" as const

export class DigestError extends Data.TaggedError("DigestError") {}

export class SignatureError extends Data.TaggedError("SignatureError") {}

export class Signature extends Context.Service<Signature, Ed25519PublicKey.Ed25519PublicKey | undefined>()(
  "crosshatch/Crypto/HttpSignature/Signature",
) {}

const calculateDigest = flow(
  Hash.digest("SHA-256"),
  Effect.map(Encoding.encodeBase64Url),
  Effect.map((v) => `sha-256=:${v}:`),
)

export const layer = Layer.effect(
  Signature,
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest
    let { method, url: pathname, headers } = request
    const signatureHeaders = Option.all({
      [SignatureKey]: Headers.get(headers, SignatureKey),
      [SignatureInputKey]: Headers.get(headers, SignatureInputKey),
    }).pipe(Option.getOrUndefined)
    if (!signatureHeaders) return
    const host = Headers.get(headers, "X-Forwarded-Host").pipe(
      Option.orElse(() => Headers.get(headers, "Host")),
      Option.getOrElse(() => new URL(request.originalUrl).host),
    )
    const { parameters, components } = parseAcceptSignature(signatureHeaders[SignatureInputKey])
    if (components.includes("digest")) {
      const digest = yield* request.arrayBuffer.pipe(Effect.flatMap(calculateDigest))
      yield* Headers.get(headers, "digest").pipe(
        Option.match({
          onNone: () => new DigestError(),
          onSome: (expected) => (digest === expected ? Effect.void : new DigestError()),
        }),
      )
    }
    const url = `https://${host}${pathname}`
    const publicKey = yield* pipe(
      parameters,
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
    return publicKey
  }),
)

export const layerFetch = Layer.effect(
  FetchHttpClient.Fetch,
  Effect.gen(function* () {
    const ref = yield* Ed25519Pair.Ed25519Pair
    const fetch = yield* Effect.serviceOption(FetchHttpClient.Fetch).pipe(
      Effect.map(Option.getOrElse(() => globalThis.fetch)),
    )
    return (input, init) =>
      Effect.gen(function* () {
        const request = new Request(input, init)
        const digest = yield* Effect.promise(() => request.clone().arrayBuffer()).pipe(Effect.flatMap(calculateDigest))
        request.headers.set("digest", digest)
        const { publicKey, privateKey } = yield* Ref.get(ref).pipe(
          Effect.flatMap(
            UndefinedOr.match({
              onDefined: Effect.succeed,
              onUndefined: () => new S.SchemaError(new SchemaIssue.InvalidValue(Option.some(undefined))),
            }),
          ),
        )
        const keyid = yield* CryptoKey.toBytes(publicKey).pipe(Effect.map(Encoding.encodeBase64Url))
        const { [SignatureKey]: signature, [SignatureInputKey]: signatureInput } = yield* Effect.promise(() =>
          signatureHeaders(request, {
            components: ["@authority", "@method", "@path", "@query", "content-type", "digest"],
            signer: {
              alg: "ed25519",
              keyid,
              sign: (data) =>
                Ed25519PrivateKey.sign(privateKey, new TextEncoder().encode(data)).pipe(Effect.runPromise),
            },
          }),
        )
        request.headers.append(SignatureKey, signature)
        request.headers.append(SignatureInputKey, signatureInput)
        return yield* Effect.promise(() => fetch(request))
      }).pipe((effect) =>
        // @effect-diagnostics-next-line runEffectInsideEffect:off
        Effect.runPromise(effect, {
          signal: init?.signal ?? undefined,
        }),
      )
  }),
)

export const layerClient = FetchHttpClient.layer.pipe(Layer.provide(layerFetch))
