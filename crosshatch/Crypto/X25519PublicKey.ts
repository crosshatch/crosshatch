import { Effect, Schema as S } from "effect"

import * as CryptoKey from "./CryptoKey.ts"

const TypeId = "crosshatch/Crypto/X25519PublicKey" as const

export const X25519PublicKey = S.Struct({
  [TypeId]: S.tag(TypeId),
  inner: CryptoKey.CryptoKey,
})

export const encrypt = Effect.fn(function* ({ inner }: typeof X25519PublicKey.Type, value: Uint8Array) {
  const eph = yield* Effect.promise(() =>
    crypto.subtle.generateKey({ name: "X25519" }, false, ["deriveKey", "deriveBits"]),
  )
  const aeadKey = yield* Effect.promise(() =>
    crypto.subtle.deriveKey(
      {
        name: "X25519",
        public: inner,
      },
      eph.privateKey,
      {
        length: 256,
        name: "AES-GCM",
      },
      false,
      ["encrypt"],
    ),
  )
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cv = yield* Effect.promise(() => crypto.subtle.encrypt({ iv, name: "AES-GCM" }, aeadKey, value.slice())).pipe(
    Effect.map((v) => new Uint8Array(v)),
  )
  const encrypter = yield* Effect.promise(() => crypto.subtle.exportKey("raw", eph.publicKey)).pipe(
    Effect.map((v) => new Uint8Array(v)),
  )
  return { cv, encrypter, iv }
})

export const fromBytes = (raw: Uint8Array) =>
  Effect.promise(() => crypto.subtle.importKey("raw", raw.slice(), { name: "X25519" }, false, [])).pipe(
    Effect.map((inner) => X25519PublicKey.make({ inner })),
  )
