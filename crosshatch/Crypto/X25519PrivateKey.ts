import { Effect, Schema as S } from "effect"

import * as CryptoKey from "./CryptoKey.ts"
import type { Asymmetric } from "./Envelope.ts"

export const X25519PrivateKey = CryptoKey.CryptoKey.pipe(S.brand("crosshatch/X25519PrivateKey"))

export const decrypt = Effect.fnUntraced(function* (
  privateKey: typeof X25519PrivateKey.Type,
  value: typeof Asymmetric.Type,
) {
  const ephPublicKey = yield* Effect.promise(() =>
    crypto.subtle.importKey("raw", value.encrypter.slice(), { name: "X25519" }, false, []),
  )
  const aeadKey = yield* Effect.promise(() =>
    crypto.subtle.deriveKey(
      { name: "X25519", public: ephPublicKey },
      privateKey,
      { length: 256, name: "AES-GCM" },
      false,
      ["decrypt"],
    ),
  )
  return yield* Effect.promise(() =>
    crypto.subtle.decrypt({ iv: value.iv.slice(), name: "AES-GCM" }, aeadKey, value.cv.slice()),
  ).pipe(Effect.map((v) => new Uint8Array(v)))
})

export const toPkcs8 = (privateKey: typeof X25519PrivateKey.Type) =>
  Effect.promise(() => crypto.subtle.exportKey("pkcs8", privateKey)).pipe(Effect.map((v) => new Uint8Array(v)))

export const fromPkcs8 = (value: Uint8Array) =>
  Effect.promise(() =>
    crypto.subtle.importKey("pkcs8", value.slice(), { name: "X25519" }, false, ["deriveKey", "deriveBits"]),
  ).pipe(Effect.map(X25519PrivateKey.make))
