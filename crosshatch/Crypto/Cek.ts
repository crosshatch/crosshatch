import { Effect, Schema as S } from "effect"

import * as CryptoKey from "./CryptoKey.ts"
import { Symmetric } from "./Envelope.ts"

const AES_GCM = "AES-GCM"
const AES_KEY_BITS = 256
const GCM_TAG_BITS = 128

export const Cek = CryptoKey.CryptoKey.pipe(S.brand("crosshatch/Cek"))

export const fromBytes = (bytes: Uint8Array, config?: { readonly extractable?: boolean | undefined }) =>
  Effect.promise(() =>
    crypto.subtle.importKey("raw", bytes.slice(), { name: AES_GCM }, config?.extractable ?? false, [
      "encrypt",
      "decrypt",
    ]),
  ).pipe(Effect.map((v) => Cek.make(v)))

export const toBytes = (cek: typeof Cek.Type) => CryptoKey.toBytes(cek)

export const random = (config?: { readonly extractable?: boolean | undefined }) =>
  Effect.sync(() => crypto.getRandomValues(new Uint8Array(32))).pipe(Effect.flatMap((v) => fromBytes(v, config)))

export const fromPrf = Effect.fnUntraced(function* (
  value: Uint8Array,
  config?: { readonly extractable?: boolean | undefined },
) {
  const baseKey = yield* Effect.promise(() =>
    crypto.subtle.importKey("raw", value.slice(), "HKDF", false, ["deriveKey"]),
  )
  return yield* Effect.promise(() =>
    crypto.subtle.deriveKey(
      {
        hash: "SHA-256",
        name: "HKDF",
        salt: new Uint8Array(),
      },
      baseKey,
      {
        length: AES_KEY_BITS,
        name: AES_GCM,
      },
      config?.extractable ?? false,
      ["encrypt", "decrypt"],
    ),
  ).pipe(Effect.map((v) => Cek.make(v)))
})

export const encrypt = Effect.fnUntraced(function* (cek: typeof Cek.Type, value: Uint8Array) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cv = yield* Effect.promise(() =>
    crypto.subtle.encrypt(
      {
        iv,
        name: AES_GCM,
        tagLength: GCM_TAG_BITS,
      },
      cek,
      value.slice(),
    ),
  ).pipe(Effect.map((v) => new Uint8Array(v)))
  return { cv, iv }
})

export const decrypt = (cek: typeof Cek.Type, { cv, iv }: typeof Symmetric.Type) =>
  Effect.promise(() =>
    crypto.subtle.decrypt(
      {
        iv: iv.slice(),
        name: AES_GCM,
        tagLength: GCM_TAG_BITS,
      },
      cek,
      cv.slice(),
    ),
  ).pipe(Effect.map((v) => new Uint8Array(v)))
