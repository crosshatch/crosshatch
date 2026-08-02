import { Effect, Schema as S, Context, type Ref } from "effect"

import { X25519PrivateKey } from "./X25519PrivateKey.ts"
import { X25519PublicKey } from "./X25519PublicKey.ts"

const TypeId = "~crosshatch/Crypto/X25519Pair" as const

export type X25519Pair = typeof X25519Pair.Type
export const X25519Pair = S.Struct({
  [TypeId]: S.tag(TypeId),
  privateKey: X25519PrivateKey,
  publicKey: X25519PublicKey,
})

export class X25519PairRef extends Context.Service<X25519PairRef, Ref.Ref<X25519Pair>>()(
  "crosshatch/Crypto/X25519PairRef",
) {}

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
