import { assert, describe, it } from "@effect/vitest"
import { BigDecimal, Effect, Schema as S } from "effect"

import * as Amount from "./Amount.ts"
import * as Atomic from "./Atomic.ts"
import * as Decimals from "./Decimals.ts"

const fromAmountCases = [
  { amount: "4.02", decimals: 6, expected: "4020000" },
  { amount: 1, decimals: 6, expected: "1000000" },
  { amount: 1, decimals: 18, expected: `1${"0".repeat(18)}` },
  { amount: 0, decimals: 6, expected: "0" },
  { amount: "1e5", decimals: 6, expected: "100000000000" },
  { amount: 1, decimals: 0, expected: "1" },
  { amount: "1.1", decimals: 0, expected: "1" },
  { amount: "1.5", decimals: 0, expected: "1" },
  { amount: "1.12345678", decimals: 7, expected: "11234567" },
  { amount: "1.0000001", decimals: 6, expected: "1000000" },
  { amount: "1.000001", decimals: 6, expected: "1000001" },
  { amount: "0.9999991", decimals: 6, expected: "999999" },
  { amount: "0.000001", decimals: 6, expected: "1" },
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
    Effect.fn(function* ({ amount, decimals, expected }) {
      assert.strictEqual<string>(yield* Atomic.fromAmount(yield* Amount.from(amount), decimals), expected)
    }),
  )

  it.effect(
    "rejects non-zero amounts smaller than one atomic unit",
    Effect.fn(function* () {
      for (const amount of ["0.0000001", "0.00000001", "0.0000000001"] as const) {
        const parsed = yield* Amount.from(amount)
        const error = yield* Atomic.fromAmount(parsed, 6).pipe(Effect.flip)
        assert.isTrue(S.isSchemaError(error))
        assert.match(error.message, /representable with 6 decimal places/u)
        assert.isTrue(BigDecimal.equals(error.issue.input as Amount.Amount, parsed))
      }
      assert.strictEqual(yield* Atomic.fromAmount(yield* Amount.from(0), 6), "0")
    }),
  )

  it.effect(
    "converts large values without assuming an asset limit",
    Effect.fn(function* () {
      const atomic = yield* Atomic.fromAmount(yield* Amount.from(10n ** 200n), 18)
      assert.strictEqual(atomic, `1${"0".repeat(218)}`)
      assert.strictEqual(yield* S.decodeEffect(Atomic.Atomic)(atomic), atomic)
    }),
  )

  it.effect(
    "round-trips canonical atomic values at boundary precisions",
    Effect.fn(function* () {
      const atomicValues = ["0", "1", "999999", `1${"0".repeat(200)}1`] as const
      for (const decimals of [0, 6, 18, Decimals.MAX_DECIMALS]) {
        for (const value of atomicValues) {
          const atomic = Atomic.Atomic.make(value)
          assert.strictEqual(yield* Atomic.fromAmount(yield* Amount.fromAtomic(atomic, decimals), decimals), atomic)
        }
      }
    }),
  )

  it.effect(
    "rejects forged atomic values when encoding",
    Effect.fn(function* () {
      for (const value of ["01", "-1", "1.0"] as const) {
        assert.isTrue(S.isSchemaError(yield* S.encodeEffect(Atomic.Atomic)(value as Atomic.Atomic).pipe(Effect.flip)))
      }
    }),
  )
})
