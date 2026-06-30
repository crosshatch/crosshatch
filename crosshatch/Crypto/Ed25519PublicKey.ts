import { Effect, Schema as S } from "effect"

import * as CryptoKey from "./CryptoKey.ts"

const PublicKeyTypeId = "crosshatch/Crypto/Ed25519PublicKey" as const

export class Ed25519PublicKey extends S.Class<Ed25519PublicKey>("Ed25519PublicKey")({
  [PublicKeyTypeId]: S.tag(PublicKeyTypeId),
  inner: CryptoKey.CryptoKey,
}) {}

export const fromBytes = (raw: Uint8Array) =>
  Effect.promise(() => crypto.subtle.importKey("raw", raw.slice(), { name: "Ed25519" }, true, ["verify"])).pipe(
    Effect.map((inner) => Ed25519PublicKey.make({ inner })),
  )

export const verify = (verifier: typeof Ed25519PublicKey.Type, signature: Uint8Array, data: Uint8Array) =>
  Effect.promise(() => crypto.subtle.verify({ name: "Ed25519" }, verifier.inner, signature.slice(), data.slice()))
