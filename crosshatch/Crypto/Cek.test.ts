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
      expect(decrypted).toEqual(data)
    }),
  )
})
