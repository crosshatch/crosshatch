import { Effect, Schema as S } from "effect"

import { X25519PrivateKey } from "./X25519PrivateKey.ts"
import { X25519PublicKey } from "./X25519PublicKey.ts"

const TypeId = "crosshatch/X25519Pair" as const

export const X25519Pair = S.Struct({
  [TypeId]: S.tag(TypeId),
  privateKey: X25519PrivateKey,
  publicKey: X25519PublicKey,
})

export const random = (config?: { readonly extractable?: boolean | undefined }) =>
  Effect.promise(() =>
    crypto.subtle.generateKey({ name: "X25519" }, config?.extractable ?? false, ["deriveKey", "deriveBits"]),
  ).pipe(
    Effect.map(({ privateKey, publicKey }) =>
      X25519Pair.make({
        privateKey: X25519PrivateKey.make(privateKey),
        publicKey: X25519PublicKey.make(publicKey),
      }),
    ),
  )
