import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"

import { Ed25519Pair, Ed25519PrivateKey, Ed25519PublicKey, CryptoKey } from "./Crypto.ts"

describe(import.meta.url, () => {
  it.effect(
    "signing and verifying",
    Effect.fn(function* () {
      const { privateKey, publicKey } = yield* Ed25519Pair.random()
      const data = new TextEncoder().encode("crosshatching")
      const signature = yield* Ed25519PrivateKey.sign(privateKey, data)
      const verification = yield* Ed25519PublicKey.verify(publicKey, signature, data)
      expect(verification).toBe(true)
    }),
  )
  it.effect(
    "public key serialization roundtrip",
    Effect.fn(function* () {
      const { publicKey } = yield* Ed25519Pair.random()
      const raw = yield* CryptoKey.toBytes(publicKey.inner)
      const hydrated = yield* Ed25519PublicKey.fromBytes(raw)
      const raw2 = yield* CryptoKey.toBytes(hydrated.inner)
      expect(raw).toEqual(raw2)
    }),
  )
})
