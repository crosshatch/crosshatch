import { Effect, Schema as S, Context, type Ref } from "effect"

import * as Ed25519PrivateKey from "./Ed25519PrivateKey.ts"
import * as Ed25519PublicKey from "./Ed25519PublicKey.ts"

const Id = "crosshatch/Crypto/Ed25519Pair" as const
const TypeId = `~${Id}`

type Ed25519Pair_ = typeof Ed25519Pair_.Type
const Ed25519Pair_ = S.Struct({
  [TypeId]: S.tag(TypeId),
  privateKey: Ed25519PrivateKey.Ed25519PrivateKey,
  publicKey: Ed25519PublicKey.Ed25519PublicKey,
})

// oxlint-disable-next-line typescript/no-empty-interface
export interface Ed25519Pair extends Ed25519Pair_ {}

export const Ed25519Pair = Object.assign(
  Context.Service<Ed25519Pair, Ref.Ref<Ed25519Pair | undefined>>()(TypeId),
  Ed25519Pair_,
)

export const fromNative = ({ privateKey, publicKey }: CryptoKeyPair) =>
  Ed25519Pair.make(
    {
      privateKey: Ed25519PrivateKey.Ed25519PrivateKey.make(privateKey, { disableChecks: true }),
      publicKey: Ed25519PublicKey.Ed25519PublicKey.make(publicKey, { disableChecks: true }),
    },
    { disableChecks: true },
  )

export const random = (config?: { readonly extractable?: boolean | undefined }) =>
  Effect.promise(() =>
    crypto.subtle.generateKey({ name: "Ed25519" }, config?.extractable ?? false, ["sign", "verify"]),
  ).pipe(Effect.map(fromNative))

export const fromSeed = (bytes: Uint8Array) =>
  Effect.all(
    {
      publicKey: Ed25519PrivateKey.fromSeed(bytes, { extractable: true }).pipe(
        Effect.flatMap((v) => Effect.promise(() => crypto.subtle.exportKey("jwk", v))),
        Effect.flatMap(({ x }) =>
          Effect.promise(() =>
            crypto.subtle.importKey("jwk", { crv: "Ed25519", kty: "OKP", ...(x && { x }) }, { name: "Ed25519" }, true, [
              "verify",
            ]),
          ),
        ),
        Effect.map((v) => Ed25519PublicKey.Ed25519PublicKey.make(v, { disableChecks: true })),
      ),
      privateKey: Ed25519PrivateKey.fromSeed(bytes),
    },
    { concurrency: "unbounded" },
  ).pipe(Effect.map((v) => Ed25519Pair.make(v, { disableChecks: true })))
