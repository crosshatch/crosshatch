import { NodeCrypto } from "@effect/platform-node"
import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"

import { Cek } from "./index.ts"

const test = it.layer(NodeCrypto.layer)

describe(import.meta.url, () => {
  test(
    "encrypting and decrypting",
    Effect.fn(function* () {
      const cek = yield* Cek.random()
      const data = new TextEncoder().encode("crosshatching")
      const decrypted = yield* Cek.decrypt(cek, yield* Cek.encrypt(cek, data))
      expect(decrypted).toStrictEqual(data)
    }),
  )
  test(
    "serialization roundtrip",
    Effect.fn(function* () {
      const cek = yield* Cek.random({ extractable: true })
      const raw = yield* Cek.toBytes(cek)
      const raw2 = yield* Cek.toBytes(yield* Cek.fromBytes(raw, { extractable: true }))
      expect(raw).toStrictEqual(raw2)
    }),
  )
})
