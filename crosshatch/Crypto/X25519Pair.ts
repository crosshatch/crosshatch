import { Effect, Schema as S, Context } from "effect"

import { X25519PrivateKey } from "./X25519PrivateKey.ts"
import { X25519PublicKey } from "./X25519PublicKey.ts"

const TypeId = "crosshatch/X25519Pair" as const

export interface X25519Pair {
  readonly [TypeId]: typeof TypeId
  readonly privateKey: typeof X25519PrivateKey.Type
  readonly publicKey: typeof X25519PublicKey.Type
}

export const X25519Pair = Object.assign(
  Context.Service<X25519Pair, X25519Pair>()(TypeId),
  S.Struct({
    [TypeId]: S.tag(TypeId),
    privateKey: X25519PrivateKey,
    publicKey: X25519PublicKey,
  }),
)

export const fromNative = ({ privateKey, publicKey }: CryptoKeyPair) =>
  X25519Pair.make(
    {
      privateKey: X25519PrivateKey.make(privateKey, { disableChecks: true }),
      publicKey: X25519PublicKey.make(publicKey, { disableChecks: true }),
    },
    { disableChecks: true },
  )

export const random = (config?: { readonly extractable?: boolean | undefined }) =>
  Effect.promise(
    () =>
      crypto.subtle.generateKey({ name: "X25519" }, config?.extractable ?? false, [
        "deriveKey",
        "deriveBits",
      ]) as Promise<CryptoKeyPair>,
  ).pipe(Effect.map(fromNative))
