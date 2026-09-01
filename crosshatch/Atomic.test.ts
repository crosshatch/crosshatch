import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema as S } from "effect"

import * as Amount from "./Amount.ts"
import * as Atomic from "./Atomic.ts"

const fromAmountCases = [
  { amount: 1, decimals: 6, expected: "1000000" },
  { amount: 1, decimals: 18, expected: `1${"0".repeat(18)}` },
  { amount: 0, decimals: 6, expected: "0" },
  { amount: "1e5", decimals: 6, expected: "100000000000" },
  { amount: 1, decimals: 0, expected: "1" },
  { amount: "1.1", decimals: 0, expected: "2" },
  { amount: "1.1", decimals: 0, rounding: "floor", expected: "1" },
  { amount: "0.0000001", decimals: 6, expected: "1" },
  { amount: "0.0000001", decimals: 6, rounding: "floor", expected: "0" },
  { amount: "1.0000001", decimals: 6, expected: "1000001" },
  { amount: "1.000001", decimals: 6, expected: "1000001" },
  { amount: "0.9999991", decimals: 6, expected: "1000000" },
  { amount: "1.0000005", decimals: 6, rounding: "half-even", expected: "1000000" },
] as const

describe(import.meta.url, () => {
  it.effect(
    "validates atomic strings",
    Effect.fn(function* () {
      assert.strictEqual(yield* S.decodeEffect(Atomic.Atomic)("0"), "0")
      assert.strictEqual(yield* S.decodeEffect(Atomic.Atomic)("1234567890"), "1234567890")
      for (const input of ["", "01", "-1", "+1", "1.0", "1e6", " 1", "abc"] as const) {
        assert.isTrue(S.isSchemaError(yield* Effect.flip(S.decodeEffect(Atomic.Atomic)(input))))
      }
    }),
  )

  it.effect.each(fromAmountCases)(
    "converts $amount to $expected atomic units with $decimals decimals",
    Effect.fn(function* ({ amount, decimals, expected, ...options }) {
      assert.strictEqual<string>(
        yield* Atomic.fromAmount(yield* Amount.from(amount), { decimals, ...options }),
        expected,
      )
    }),
  )

  it.effect(
    "converts large values without assuming an asset limit",
    Effect.fn(function* () {
      const atomic = yield* Atomic.fromAmount(yield* Amount.from(10n ** 200n), { decimals: 18 })
      assert.strictEqual(atomic, `1${"0".repeat(218)}`)
      assert.strictEqual(yield* S.decodeEffect(Atomic.Atomic)(atomic), atomic)
    }),
  )
})
