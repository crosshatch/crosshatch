import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"

import { Cek } from "./Crypto.ts"

describe(import.meta.url, () => {
  it.effect(
    "encrypting and decrypting",
    Effect.fn(function* () {
      const cek = yield* Cek.random
      const data = new TextEncoder().encode("crosshatching")
      const cv = yield* Cek.encrypt(cek, data)
      const decrypted = yield* Cek.decrypt(cek, cv)
      expect(decrypted).toStrictEqual(data)
    }),
  )
  it.effect(
    "serialization roundtrip",
    Effect.fn(function* () {
      const cek = yield* Cek.random
      const raw = yield* Cek.toBytes(cek)
      const hydrated = yield* Cek.fromBytes(raw)
      const raw2 = yield* Cek.toBytes(hydrated)
      expect(raw).toStrictEqual(raw2)
    }),
  )
})
