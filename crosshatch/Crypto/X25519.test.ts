import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"

import { X25519Pair, X25519PrivateKey, X25519PublicKey } from "./Crypto.ts"

describe(import.meta.url, () => {
  it.effect(
    "encrypting and decrypting",
    Effect.fn(function* () {
      const { privateKey, publicKey } = yield* X25519Pair.random()
      const data = new TextEncoder().encode("crosshatching")
      const cva = yield* X25519PublicKey.encrypt(publicKey, data)
      const decrypted = yield* X25519PrivateKey.decrypt(privateKey, cva)
      expect(decrypted).toEqual(data)
    }),
  )
})
