import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"

import { Cek } from "./Crypto.ts"

describe(import.meta.url, () => {
  it.effect(
    "encrypting and decrypting",
    Effect.fn(function* () {
      const cek = yield* Cek.random()
      const data = new TextEncoder().encode("crosshatching")
      const decrypted = yield* Cek.decrypt(cek, yield* Cek.encrypt(cek, data))
      expect(decrypted).toStrictEqual(data)
    }),
  )
  it.effect(
    "serialization roundtrip",
    Effect.fn(function* () {
      const cek = yield* Cek.random({ extractable: true })
      const raw = yield* Cek.toBytes(cek)
      const raw2 = yield* Cek.toBytes(yield* Cek.fromBytes(raw, { extractable: true }))
      expect(raw).toStrictEqual(raw2)
    }),
  )
})
