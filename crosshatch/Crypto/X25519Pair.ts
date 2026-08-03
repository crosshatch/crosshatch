import { Effect, Schema as S, Context, type Ref } from "effect"

import { X25519PrivateKey } from "./X25519PrivateKey.ts"
import { X25519PublicKey } from "./X25519PublicKey.ts"

const TypeId = "~crosshatch/Crypto/X25519Pair" as const

type X25519Pair_ = typeof X25519Pair_.Type
const X25519Pair_ = S.Struct({
  [TypeId]: S.tag(TypeId),
  privateKey: X25519PrivateKey,
  publicKey: X25519PublicKey,
})

// oxlint-disable-next-line typescript/no-empty-interface
export interface X25519Pair extends X25519Pair_ {}

export const X25519Pair = Object.assign(
  Context.Service<X25519Pair, Ref.Ref<X25519Pair | undefined>>()("crosshatch/Crypto/X25519Pair"),
  X25519Pair_,
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
