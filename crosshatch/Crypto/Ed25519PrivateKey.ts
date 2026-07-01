import { Effect, Schema as S } from "effect"

import { CryptoKey } from "./CryptoKey.ts"

export const Ed25519PrivateKey = CryptoKey.pipe(S.brand("crosshatch/Ed25519PrivateKey"))

export const sign = (privateKey: typeof Ed25519PrivateKey.Type, data: Uint8Array) =>
  Effect.promise(() => crypto.subtle.sign({ name: "Ed25519" }, privateKey, data.slice())).pipe(
    Effect.map((v) => new Uint8Array(v)),
  )
