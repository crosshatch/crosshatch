import { Effect, Schema as S } from "effect"

import * as CryptoKey from "./CryptoKey.ts"
import * as Random from "./Random.ts"

export type X25519PublicKey = typeof X25519PublicKey.Type
export const X25519PublicKey = CryptoKey.CryptoKey.pipe(S.brand("crosshatch/Crypto/X25519PublicKey"))

export const encrypt = Effect.fnUntraced(function* (publicKey: X25519PublicKey, value: Uint8Array) {
  const eph = yield* Effect.promise(
    () => crypto.subtle.generateKey({ name: "X25519" }, false, ["deriveKey", "deriveBits"]) as Promise<CryptoKeyPair>,
  )
  const aeadKey = yield* Effect.promise(() =>
    crypto.subtle.deriveKey(
      {
        name: "X25519",
        public: publicKey,
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
  const iv = Random.bytes(12)
  const cv = yield* Effect.promise(() => crypto.subtle.encrypt({ iv, name: "AES-GCM" }, aeadKey, value.slice())).pipe(
    Effect.map((v) => new Uint8Array(v)),
  )
  const encrypter = yield* Effect.promise(() => crypto.subtle.exportKey("raw", eph.publicKey)).pipe(
    Effect.map((v) => new Uint8Array(v)),
  )
  return { cv, encrypter, iv }
})

export const fromBytes = (raw: Uint8Array) =>
  Effect.promise(() => crypto.subtle.importKey("raw", raw.slice(), { name: "X25519" }, true, [])).pipe(
    Effect.map((v) => X25519PublicKey.make(v, { disableChecks: true })),
  )
