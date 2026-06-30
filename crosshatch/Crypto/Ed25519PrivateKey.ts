import { Effect, Schema as S } from "effect"

import { CryptoKey } from "./CryptoKey.ts"

const PrivateKeyTypeId = "crosshatch/Crypto/Ed25519PrivateKey" as const

export class Ed25519PrivateKey extends S.Class<Ed25519PrivateKey>("Ed25519PrivateKey")({
  [PrivateKeyTypeId]: S.tag(PrivateKeyTypeId),
  inner: CryptoKey,
}) {}

export const sign = ({ inner }: typeof Ed25519PrivateKey.Type, data: Uint8Array) =>
  Effect.promise(() => crypto.subtle.sign({ name: "Ed25519" }, inner, data.slice())).pipe(
    Effect.map((v) => new Uint8Array(v)),
  )
