import {
  Effect,
  Encoding,
  Ref,
  Option,
  Schema as S,
  Context,
  Data,
  pipe,
  flow,
  Layer,
  UndefinedOr,
  SchemaIssue,
} from "effect"
import { HttpServerRequest, Headers, FetchHttpClient } from "effect/unstable/http"
import { createSignature, verifySignature } from "http-message-sig"

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
    const message = new Request(`https://${host}${pathname}`, { method, headers })
    if (signatureHeaders[SignatureInputKey].includes('"digest"')) {
      const digest = yield* request.arrayBuffer.pipe(Effect.flatMap(calculateDigest))
      yield* Headers.get(headers, "digest").pipe(
        Option.match({
          onNone: () => new DigestError(),
          onSome: (expected) => (digest === expected ? Effect.void : new DigestError()),
        }),
      )
    }
    const verified = yield* Effect.tryPromise({
      try: () =>
        verifySignature(message, {
          policy: {
            algorithms: ["ed25519"],
            requiredComponents: [],
            requiredParameters: ["keyid"],
          },
          resolveVerifier: async ({ parameters }) => {
            const publicKey = await pipe(
              parameters,
              S.decodeUnknownEffect(S.Struct({ keyid: S.String })),
              Effect.map(flow((v) => v.keyid, Encoding.decodeBase64Url)),
              Effect.flatMap(Effect.fromResult),
              Effect.flatMap(Ed25519PublicKey.fromBytes),
              Effect.runPromise,
            )
            return {
              algorithm: "ed25519",
              verify: (data: Uint8Array, signature: Uint8Array) =>
                Ed25519PublicKey.verify(publicKey, signature, data).pipe(Effect.runPromise),
              publicKey,
            }
          },
        }),
      catch: () => new SignatureError(),
    })
    return verified.verifier.publicKey
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
              onUndefined: () => new S.SchemaError(new SchemaIssue.InvalidValue()),
            }),
          ),
        )
        const keyid = yield* CryptoKey.toBytes(publicKey).pipe(Effect.map(Encoding.encodeBase64Url))
        const { signature, signatureInput } = yield* Effect.promise(() =>
          createSignature(request, {
            components: ["@authority", "@method", "@path", "@query", "content-type", "digest"],
            parameters: { keyid },
            signer: {
              algorithm: "ed25519",
              sign: (data: Uint8Array) => Ed25519PrivateKey.sign(privateKey, data).pipe(Effect.runPromise),
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
