import { assert, describe, it } from "@effect/vitest"
import { BigDecimal, Effect, Schema as S } from "effect"

import * as Amount from "./Amount.ts"

const assertAmount = (actual: Amount.Amount, expected: string) =>
  assert.isTrue(
    BigDecimal.equals(actual, BigDecimal.fromStringUnsafe(expected)),
    `expected ${BigDecimal.format(actual)} to equal ${expected}`,
  )

const parseCases = [
  { input: "10", expected: "10" },
  { input: "1.5", expected: "1.5" },
  { input: " 1.5 ", expected: "1.5" },
  { input: ".5", expected: "0.5" },
  { input: "1.", expected: "1" },
  { input: "0.000001", expected: "0.000001" },
  { input: "0", expected: "0" },
  { input: "+1", expected: "1" },
] as const

const invalidInputs = ["", "-1", "not-a-number", "$1", -1, Infinity, NaN, -1n] as const

const toAtomicCases = [
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

const displayCases = [
  { amount: 20, decimals: 2, expected: "20.00" },
  { amount: "1.5", decimals: 2, expected: "1.50" },
  { amount: "1.239", decimals: 2, expected: "1.23" },
  { amount: "1.9", decimals: 0, expected: "1" },
  { amount: 0, decimals: 2, expected: "0.00" },
  { amount: "0.001", decimals: 2, expected: "0.00" },
] as const

describe(import.meta.url, () => {
  it.effect.each(parseCases)(
    "parses $input as $expected",
    Effect.fn(function* ({ expected, input }) {
      assertAmount(yield* Amount.from(input), expected)
    }),
  )

  it.effect.each(invalidInputs)(
    "rejects invalid input %s",
    Effect.fn(function* (input) {
      assert.isTrue(S.isSchemaError(yield* Effect.flip(Amount.from(input))))
    }),
  )

  it.effect(
    "reports why input is invalid",
    Effect.fn(function* () {
      const error = (input: Amount.Input) => Effect.flip(Amount.from(input))
      assert.match((yield* error("")).message, /non-empty amount string/u)
      assert.match((yield* error("   ")).message, /non-empty amount string/u)
      assert.match((yield* error("not-a-number")).message, /parsed into a BigDecimal/u)
      assert.match((yield* error("-1")).message, /greater than or equal to 0/u)
      assert.match((yield* error(-1n)).message, /greater than or equal to 0/u)
      assert.match((yield* error(NaN)).message, /finite number/u)
      assert.match((yield* error(Infinity)).message, /finite number/u)
      assert.strictEqual((yield* error("")).issue.input, "")
    }),
  )

  it.effect(
    "supports arbitrary-size amounts",
    Effect.fn(function* () {
      assertAmount(yield* Amount.from("1e5"), "100000")
      assertAmount(yield* Amount.from("1e65"), `1${"0".repeat(65)}`)
      assertAmount(yield* Amount.from(10n ** 200n), `1${"0".repeat(200)}`)
      assert.strictEqual(yield* S.decodeEffect(Amount.Atomic)(`1${"0".repeat(200)}`), `1${"0".repeat(200)}`)
      assertAmount(yield* S.decodeEffect(Amount.Amount)(BigDecimal.make(10n ** 200n, 0)), `1${"0".repeat(200)}`)
    }),
  )

  it.effect(
    "rejects invalid BigDecimal scales",
    Effect.fn(function* () {
      assert.match((yield* Amount.from(BigDecimal.make(15n, 1.5)).pipe(Effect.flip)).message, /safe integer scale/u)
      assert.match((yield* Amount.from(BigDecimal.make(15n, NaN)).pipe(Effect.flip)).message, /safe integer scale/u)
      assert.match(
        (yield* Effect.flip(BigDecimal.make(15n, Number.MAX_SAFE_INTEGER + 1).pipe(S.decodeEffect(Amount.Amount))))
          .message,
        /safe integer scale/u,
      )
    }),
  )

  it.effect(
    "validates atomic strings",
    Effect.fn(function* () {
      assert.strictEqual(yield* S.decodeEffect(Amount.Atomic)("0"), "0")
      assert.strictEqual(yield* S.decodeEffect(Amount.Atomic)("1234567890"), "1234567890")
      for (const input of ["", "01", "-1", "+1", "1.0", "1e6", " 1", "abc"] as const) {
        assert.isTrue(S.isSchemaError(yield* Effect.flip(S.decodeEffect(Amount.Atomic)(input))))
      }
    }),
  )

  it.effect(
    "converts large atomic values without assuming an asset limit",
    Effect.fn(function* () {
      const atomic = yield* Amount.toAtomic(yield* Amount.from(10n ** 200n), { decimals: 18 })
      assert.strictEqual(atomic, `1${"0".repeat(218)}`)
      assert.strictEqual(yield* S.decodeEffect(Amount.Atomic)(atomic), atomic)
    }),
  )

  it.effect(
    "constructs from numbers, bigints, strings, and decimals",
    Effect.fn(function* () {
      assertAmount(yield* Amount.from(0.01), "0.01")
      assertAmount(yield* Amount.from(10n), "10")
      assertAmount(yield* Amount.from("1.5"), "1.5")
      assertAmount(yield* Amount.from(BigDecimal.fromStringUnsafe("2.5")), "2.5")
      const error = yield* Amount.from(-0.01).pipe(Effect.flip)
      assert.isTrue(S.isSchemaError(error))
    }),
  )

  it.effect.each(toAtomicCases)(
    "converts $amount to $expected atomic units with $decimals decimals",
    Effect.fn(function* ({ amount, decimals, expected, ...options }) {
      assert.strictEqual<string>(yield* Amount.toAtomic(yield* Amount.from(amount), { decimals, ...options }), expected)
    }),
  )

  it.effect(
    "validates decimal precision across public APIs",
    Effect.fn(function* () {
      const amount = yield* Amount.from(1)
      const atomic = Amount.Atomic.make("1")
      for (const decimals of [-1, 1.5, NaN, Infinity, Amount.MAX_DECIMALS + 1, Number.MAX_SAFE_INTEGER]) {
        assert.isTrue(S.isSchemaError(yield* Effect.flip(Amount.toAtomic(amount, { decimals }))))
        assert.isTrue(S.isSchemaError(yield* Effect.flip(Amount.fromAtomic(atomic, { decimals }))))
        assert.isTrue(S.isSchemaError(yield* Effect.flip(Amount.display(amount, decimals))))
        assert.isTrue(S.isSchemaError(yield* Effect.flip(S.decodeEffect(Amount.atomic({ decimals }))(atomic))))
        assert.isTrue(S.isSchemaError(yield* Effect.flip(amount.pipe(S.encodeEffect(Amount.atomic({ decimals }))))))
      }
    }),
  )

  it.effect(
    "supports large decimal precision",
    Effect.fn(function* () {
      assertAmount(yield* Amount.fromAtomic(Amount.Atomic.make("1"), { decimals: 65 }), `0.${"0".repeat(64)}1`)
    }),
  )

  it.effect(
    "accepts decimals from 0 through MAX_DECIMALS",
    Effect.fn(function* () {
      const amount = yield* Amount.from(1)
      const atomic = Amount.Atomic.make("1")

      assert.strictEqual(yield* Amount.toAtomic(amount, { decimals: 0 }), "1")
      assertAmount(yield* Amount.fromAtomic(atomic, { decimals: 0 }), "1")
      assert.strictEqual(yield* Amount.display(amount, 0), "1")
      assertAmount(yield* S.decodeEffect(Amount.atomic({ decimals: 0 }))(atomic), "1")
      assert.strictEqual(yield* amount.pipe(S.encodeEffect(Amount.atomic({ decimals: 0 }))), "1")
      assert.strictEqual(
        yield* Amount.toAtomic(yield* Amount.fromAtomic(Amount.Atomic.make("0"), { decimals: 0 }), { decimals: 0 }),
        "0",
      )

      const max = Amount.MAX_DECIMALS
      assert.strictEqual(yield* Amount.toAtomic(amount, { decimals: max }), `1${"0".repeat(max)}`)
      assertAmount(yield* Amount.fromAtomic(atomic, { decimals: max }), `0.${"0".repeat(max - 1)}1`)
      assert.strictEqual(yield* Amount.display(amount, max), `1.${"0".repeat(max)}`)
      assertAmount(yield* S.decodeEffect(Amount.atomic({ decimals: max }))(atomic), `0.${"0".repeat(max - 1)}1`)
      assert.strictEqual(yield* amount.pipe(S.encodeEffect(Amount.atomic({ decimals: max }))), `1${"0".repeat(max)}`)
      assert.strictEqual(
        yield* Amount.toAtomic(yield* Amount.fromAtomic(atomic, { decimals: max }), { decimals: max }),
        "1",
      )
    }),
  )

  it.effect(
    "converts atomic units to nominal amounts losslessly",
    Effect.fn(function* () {
      assertAmount(yield* Amount.fromAtomic(Amount.Atomic.make("1000000"), { decimals: 6 }), "1")
      assertAmount(yield* Amount.fromAtomic(Amount.Atomic.make("0"), { decimals: 6 }), "0")
      assertAmount(yield* Amount.fromAtomic(Amount.Atomic.make("1"), { decimals: 18 }), "0.000000000000000001")
      const original = Amount.Atomic.make(`1${"0".repeat(200)}1`)
      const nominal = yield* Amount.fromAtomic(original, { decimals: 18 })
      assert.strictEqual(yield* Amount.toAtomic(nominal, { decimals: 18 }), original)
    }),
  )

  describe("codecs", () => {
    it.effect(
      "round-trips through the atomic schema codec",
      Effect.fn(function* () {
        const codec = Amount.atomic({ decimals: 6 })
        const decoded = yield* S.decodeEffect(codec)(Amount.Atomic.make("1500000"))
        assertAmount(decoded, "1.5")
        assert.strictEqual(yield* S.encodeEffect(codec)(decoded), "1500000")
        assert.isTrue(S.isSchemaError(yield* Effect.flip(S.decodeEffect(codec)("01"))))
        const overPrecise = yield* Amount.from("1.0000001")
        const encoded = yield* S.encodeEffect(codec)(overPrecise)
        assert.strictEqual(encoded, "1000001")
        assertAmount(yield* S.decodeEffect(codec)(encoded), "1.000001")
      }),
    )

    it.effect(
      "round-trips through the string schema codec",
      Effect.fn(function* () {
        const decoded = yield* S.decodeEffect(Amount.AmountFromString)("1.50")
        assertAmount(decoded, "1.5")
        assert.strictEqual(yield* S.encodeEffect(Amount.AmountFromString)(decoded), "1.5")
        assert.isTrue(S.isSchemaError(yield* Effect.flip(S.decodeEffect(Amount.AmountFromString)("-1"))))
        assert.isTrue(S.isSchemaError(yield* Effect.flip(S.decodeEffect(Amount.AmountFromString)(""))))
        assert.isTrue(S.isSchemaError(yield* Effect.flip(S.decodeEffect(Amount.AmountFromString)("   "))))
        assertAmount(yield* S.decodeEffect(Amount.AmountFromString)("1".repeat(200)), "1".repeat(200))
        const exponent = yield* S.decodeEffect(Amount.AmountFromString)("1e5")
        assertAmount(exponent, "100000")
        assert.strictEqual(yield* S.encodeEffect(Amount.AmountFromString)(exponent), "100000")
        const fraction = yield* S.decodeEffect(Amount.AmountFromString)("1e-5")
        assertAmount(fraction, "0.00001")
        assert.strictEqual(yield* S.encodeEffect(Amount.AmountFromString)(fraction), "0.00001")
        const dust = yield* S.decodeEffect(Amount.AmountFromString)("1e-18")
        assertAmount(dust, "0.000000000000000001")
        assert.strictEqual(yield* S.encodeEffect(Amount.AmountFromString)(dust), "0.000000000000000001")
      }),
    )
  })

  describe("formatting", () => {
    it.effect(
      "formats nominal amounts",
      Effect.fn(function* () {
        assert.strictEqual(Amount.format(yield* Amount.from(10)), "10")
        assert.strictEqual(Amount.format(yield* Amount.from("1.50")), "1.5")
        assert.strictEqual(Amount.format(yield* Amount.from("0.000001")), "0.000001")
        assert.strictEqual(
          Amount.format(yield* Amount.fromAtomic(Amount.Atomic.make("1"), { decimals: 18 })),
          "0.000000000000000001",
        )
        assert.strictEqual(Amount.format(yield* Amount.from(10n ** 200n)), `1${"0".repeat(200)}`)
      }),
    )

    it.effect.each(displayCases)(
      "displays $amount as $expected with $decimals decimals",
      Effect.fn(function* ({ amount, decimals, expected }) {
        assert.strictEqual(yield* Amount.display(yield* Amount.from(amount), decimals), expected)
      }),
    )
  })
})
