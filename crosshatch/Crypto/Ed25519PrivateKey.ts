import { Effect, Schema as S } from "effect"

import { CryptoKey } from "./CryptoKey.ts"

export const Ed25519PrivateKey = CryptoKey.pipe(S.brand("crosshatch/Ed25519PrivateKey"))

/** PKCS#8 PrivateKeyInfo prefix for a raw 32-byte Ed25519 seed (RFC 8410). */
const ED25519_PKCS8_PREFIX = new Uint8Array([
  0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20,
])

export const fromSeed = (bytes: Uint8Array, config?: { readonly extractable?: boolean | undefined }) => {
  const pkcs8 = new Uint8Array(ED25519_PKCS8_PREFIX.length + bytes.byteLength)
  pkcs8.set(ED25519_PKCS8_PREFIX)
  pkcs8.set(bytes, ED25519_PKCS8_PREFIX.length)
  return Effect.promise(() =>
    crypto.subtle.importKey("pkcs8", pkcs8, { name: "Ed25519" }, config?.extractable ?? false, ["sign"]),
  ).pipe(Effect.map((v) => Ed25519PrivateKey.make(v, { disableChecks: true })))
}

export const toPkcs8 = (privateKey: typeof Ed25519PrivateKey.Type) =>
  Effect.promise(() => crypto.subtle.exportKey("pkcs8", privateKey)).pipe(Effect.map((v) => new Uint8Array(v)))

export const fromPkcs8 = (value: Uint8Array) =>
  Effect.promise(() => crypto.subtle.importKey("pkcs8", value.slice(), { name: "Ed25519" }, false, ["sign"])).pipe(
    Effect.map((v) => Ed25519PrivateKey.make(v, { disableChecks: true })),
  )

export const sign = (privateKey: typeof Ed25519PrivateKey.Type, data: Uint8Array) =>
  Effect.promise(() => crypto.subtle.sign({ name: "Ed25519" }, privateKey, data.slice())).pipe(
    Effect.map((v) => new Uint8Array(v)),
  )
