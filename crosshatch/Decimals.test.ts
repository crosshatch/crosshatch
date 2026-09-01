import { assert, describe, it } from "@effect/vitest"
import { BigDecimal, Effect, Schema as S } from "effect"

import * as Decimals from "./Decimals.ts"

describe(import.meta.url, () => {
  it.effect(
    "accepts 0 through MAX_DECIMALS",
    Effect.fn(function* () {
      assert.strictEqual(yield* Decimals.decodeEffect(0), 0)
      assert.strictEqual(yield* Decimals.decodeEffect(Decimals.MAX_DECIMALS), Decimals.MAX_DECIMALS)
    }),
  )

  it.effect(
    "rejects values outside 0 through MAX_DECIMALS",
    Effect.fn(function* () {
      for (const decimals of [-1, 1.5, NaN, Infinity, Decimals.MAX_DECIMALS + 1, Number.MAX_SAFE_INTEGER]) {
        assert.isTrue(S.isSchemaError(yield* Effect.flip(Decimals.decodeEffect(decimals))))
      }
    }),
  )

  it.effect(
    "unscales to the target precision, truncating extra fraction digits",
    Effect.fn(function* () {
      const six = yield* Decimals.decodeEffect(6)
      const two = yield* Decimals.decodeEffect(2)
      const zero = yield* Decimals.decodeEffect(0)
      assert.strictEqual(BigDecimal.scale(BigDecimal.fromStringUnsafe("1.23"), six).value, 1230000n)
      assert.strictEqual(BigDecimal.scale(BigDecimal.fromStringUnsafe("1.239"), two).value, 123n)
      assert.strictEqual(BigDecimal.scale(BigDecimal.fromStringUnsafe("0"), six).value, 0n)
      assert.strictEqual(BigDecimal.scale(BigDecimal.fromStringUnsafe("1.9"), zero).value, 1n)
      assert.strictEqual(BigDecimal.scale(BigDecimal.make(15n, -2), six).value, 1500000000n)
    }),
  )
})
