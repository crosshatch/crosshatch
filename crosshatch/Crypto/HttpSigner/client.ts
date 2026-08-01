import { Effect, Layer, Option, Encoding, Ref } from "effect"
import { FetchHttpClient } from "effect/unstable/http"
import { signatureHeaders } from "http-message-sig"

import * as CryptoKey from "../CryptoKey.ts"
import { CurrentEd25519Pair } from "../Ed25519Pair.ts"
import * as Ed25519PrivateKey from "../Ed25519PrivateKey.ts"
import * as Hash from "../Hash.ts"
import { SignatureInputKey, SignatureKey } from "./constants.ts"

export const layerFetch = Layer.effect(
  FetchHttpClient.Fetch,
  Effect.gen(function* () {
    const ref = yield* CurrentEd25519Pair
    const fetch = yield* Effect.serviceOption(FetchHttpClient.Fetch).pipe(
      Effect.map(Option.getOrElse(() => globalThis.fetch)),
    )
    return (input, init) =>
      Effect.gen(function* () {
        const request = new Request(input, init)
        const digest = yield* Effect.promise(() => request.clone().arrayBuffer()).pipe(
          Effect.flatMap(Hash.digest("SHA-256")),
          Effect.map(Encoding.encodeBase64Url),
          Effect.map((v) => `sha-256=:${v}:`),
        )
        request.headers.set("digest", digest)
        const { publicKey, privateKey } = yield* Ref.get(ref)
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
