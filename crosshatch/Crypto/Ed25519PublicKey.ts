import { Effect, Schema as S } from "effect"

import { CryptoKey } from "./CryptoKey.ts"

export const Ed25519PublicKey = CryptoKey.pipe(S.brand("crosshatch/Ed25519PublicKey"))

export const fromBytes = (raw: Uint8Array) =>
  Effect.promise(() => crypto.subtle.importKey("raw", raw.slice(), { name: "Ed25519" }, true, ["verify"])).pipe(
    Effect.map(Ed25519PublicKey.make),
  )

export const verify = (verifier: typeof Ed25519PublicKey.Type, signature: Uint8Array, data: Uint8Array) =>
  Effect.promise(() => crypto.subtle.verify({ name: "Ed25519" }, verifier, signature.slice(), data.slice()))
