import { Effect, Schema as S } from "effect"

import * as CryptoKey from "./CryptoKey.ts"

export type Ed25519PublicKey = typeof Ed25519PublicKey.Type
export const Ed25519PublicKey = CryptoKey.CryptoKey.pipe(S.brand("crosshatch/Crypto/Ed25519PublicKey"))

export const fromBytes = (raw: Uint8Array) =>
  Effect.promise(() => crypto.subtle.importKey("raw", raw.slice(), { name: "Ed25519" }, true, ["verify"])).pipe(
    Effect.map((v) => Ed25519PublicKey.make(v, { disableChecks: true })),
  )

export const verify = (verifier: Ed25519PublicKey, signature: Uint8Array, data: Uint8Array) =>
  Effect.promise(() => crypto.subtle.verify({ name: "Ed25519" }, verifier, signature.slice(), data.slice()))
