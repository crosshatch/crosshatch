import { Effect, Schema as S } from "effect"

import { Ed25519PrivateKey } from "./Ed25519PrivateKey.ts"
import { Ed25519PublicKey } from "./Ed25519PublicKey.ts"

const TypeId = "crosshatch/Ed25519Pair" as const

export class Ed25519Pair extends S.Class<Ed25519Pair>("Ed25519Pair")({
  [TypeId]: S.tag(TypeId),
  privateKey: Ed25519PrivateKey,
  publicKey: Ed25519PublicKey,
}) {}

export const fromCryptoKeyPair = ({ privateKey, publicKey }: CryptoKeyPair) =>
  Ed25519Pair.make({
    privateKey: Ed25519PrivateKey.make(privateKey),
    publicKey: Ed25519PublicKey.make(publicKey),
  })

export const random = (config?: { readonly extractable?: boolean | undefined }) =>
  Effect.promise(() =>
    crypto.subtle.generateKey({ name: "Ed25519" }, config?.extractable ?? false, ["sign", "verify"]),
  ).pipe(Effect.map(fromCryptoKeyPair))
