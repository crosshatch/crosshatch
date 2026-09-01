import { assert, describe, it } from "@effect/vitest"
import { BigDecimal, Effect, Schema as S } from "effect"

import * as Amount from "./Amount.ts"
import * as Atomic from "./Atomic.ts"
import * as Decimals from "./Decimals.ts"

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

const displayCases = [
  { amount: 20, decimals: 2, expected: "20.00" },
  { amount: "1.5", decimals: 2, expected: "1.50" },
  { amount: "1.239", decimals: 2, expected: "1.23" },
  { amount: "1.9", decimals: 0, expected: "1" },
  { amount: 0, decimals: 2, expected: "0.00" },
  { amount: "0.001", decimals: 2, expected: "0.00" },
  { amount: "100.5", decimals: 2, expected: "100.50" },
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
      const error = (input: Amount.AmountInput) => Effect.flip(Amount.from(input, { reportInput: true }))
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
      assertAmount(yield* S.decodeEffect(Amount.Amount)(BigDecimal.make(10n ** 200n, 0)), `1${"0".repeat(200)}`)
    }),
  )

  it.effect(
    "accepts bounded scales and rejects unsafe expansion",
    Effect.fn(function* () {
      assertAmount(yield* Amount.from("1e255"), `1${"0".repeat(255)}`)
      assertAmount(yield* Amount.from("1e-255"), `0.${"0".repeat(254)}1`)
      assert.match((yield* Amount.from(BigDecimal.make(15n, 1.5)).pipe(Effect.flip)).message, /safe integer scale/u)
      assert.match((yield* Amount.from(BigDecimal.make(15n, NaN)).pipe(Effect.flip)).message, /safe integer scale/u)
      for (const input of ["1e256", "1e-256"] as const) {
        assert.match((yield* Amount.from(input).pipe(Effect.flip)).message, /between -255 and 255/u)
      }
      for (const scale of [-256, 256, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER + 1]) {
        assert.match((yield* Amount.from(BigDecimal.make(15n, scale)).pipe(Effect.flip)).message, /safe integer scale/u)
      }
      assert.match(
        (yield* Amount.from(BigDecimal.make(0n, Number.MAX_SAFE_INTEGER)).pipe(Effect.flip)).message,
        /safe integer scale/u,
      )
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
      const unsafeOptions = { disableChecks: true } as unknown as Amount.ParseOptions
      assert.isTrue(S.isSchemaError(yield* Amount.from("-1", unsafeOptions).pipe(Effect.flip)))
      assert.strictEqual(Amount.toString(yield* Amount.from(0.1 + 0.2)), `${0.1 + 0.2}`)
      assert.strictEqual(
        Amount.toString(yield* Amount.from(Number.MAX_SAFE_INTEGER + 1)),
        `${Number.MAX_SAFE_INTEGER + 1}`,
      )
    }),
  )

  it.effect(
    "validates decimal precision across public APIs",
    Effect.fn(function* () {
      const amount = yield* Amount.from(1)
      const atomic = Atomic.Atomic.make("1")
      for (const decimals of [-1, 1.5, NaN, Infinity, Decimals.MAX_DECIMALS + 1, Number.MAX_SAFE_INTEGER]) {
        assert.isTrue(S.isSchemaError(yield* Effect.flip(Atomic.fromAmount(amount, decimals))))
        assert.isTrue(S.isSchemaError(yield* Effect.flip(Amount.fromAtomic(atomic, decimals))))
        assert.isTrue(S.isSchemaError(yield* Effect.flip(Amount.display(amount, decimals))))
        assert.isTrue(S.isSchemaError(yield* Effect.flip(S.decodeEffect(Amount.AmountFromAtomic(decimals))(atomic))))
        assert.isTrue(
          S.isSchemaError(yield* Effect.flip(amount.pipe(S.encodeEffect(Amount.AmountFromAtomic(decimals))))),
        )
      }
    }),
  )

  it.effect(
    "supports large decimal precision",
    Effect.fn(function* () {
      assertAmount(yield* Amount.fromAtomic(Atomic.Atomic.make("1"), 65), `0.${"0".repeat(64)}1`)
    }),
  )

  it.effect(
    "accepts decimals from 0 through MAX_DECIMALS",
    Effect.fn(function* () {
      const amount = yield* Amount.from(1)
      const atomic = Atomic.Atomic.make("1")

      assert.strictEqual(yield* Atomic.fromAmount(amount, 0), "1")
      assertAmount(yield* Amount.fromAtomic(atomic, 0), "1")
      assert.strictEqual(yield* Amount.display(amount, 0), "1")
      assertAmount(yield* S.decodeEffect(Amount.AmountFromAtomic(0))(atomic), "1")
      assert.strictEqual(yield* amount.pipe(S.encodeEffect(Amount.AmountFromAtomic(0))), "1")
      assert.strictEqual(yield* Atomic.fromAmount(yield* Amount.fromAtomic(Atomic.Atomic.make("0"), 0), 0), "0")

      const max = Decimals.MAX_DECIMALS
      assert.strictEqual(yield* Atomic.fromAmount(amount, max), `1${"0".repeat(max)}`)
      assertAmount(yield* Amount.fromAtomic(atomic, max), `0.${"0".repeat(max - 1)}1`)
      assert.strictEqual(yield* Amount.display(amount, max), `1.${"0".repeat(max)}`)
      assertAmount(yield* S.decodeEffect(Amount.AmountFromAtomic(max))(atomic), `0.${"0".repeat(max - 1)}1`)
      assert.strictEqual(yield* amount.pipe(S.encodeEffect(Amount.AmountFromAtomic(max))), `1${"0".repeat(max)}`)
      assert.strictEqual(yield* Atomic.fromAmount(yield* Amount.fromAtomic(atomic, max), max), "1")
    }),
  )

  it.effect(
    "converts atomic units to nominal amounts losslessly",
    Effect.fn(function* () {
      assertAmount(yield* Amount.fromAtomic(Atomic.Atomic.make("1000000"), 6), "1")
      assertAmount(yield* Amount.fromAtomic(Atomic.Atomic.make("0"), 6), "0")
      assertAmount(yield* Amount.fromAtomic(Atomic.Atomic.make("1"), 18), "0.000000000000000001")
      const original = Atomic.Atomic.make(`1${"0".repeat(200)}1`)
      const nominal = yield* Amount.fromAtomic(original, 18)
      assert.strictEqual(yield* Atomic.fromAmount(nominal, 18), original)
    }),
  )

  describe("codecs", () => {
    it.effect(
      "round-trips through the atomic schema codec",
      Effect.fn(function* () {
        const codec = Amount.AmountFromAtomic(6)
        const decoded = yield* S.decodeEffect(codec)(Atomic.Atomic.make("1500000"))
        assertAmount(decoded, "1.5")
        assert.strictEqual(yield* S.encodeEffect(codec)(decoded), "1500000")
        assert.isTrue(S.isSchemaError(yield* Effect.flip(S.decodeEffect(codec)("01"))))
        const overPrecise = yield* Amount.from("1.0000001")
        const encoded = yield* S.encodeEffect(codec)(overPrecise)
        assert.strictEqual(encoded, "1000000")
        assertAmount(yield* S.decodeEffect(codec)(encoded), "1")
        assert.strictEqual(yield* S.encodeEffect(Amount.AmountFromAtomic(0))(yield* Amount.from("1.1")), "1")
        assert.isTrue(S.isSchemaError(yield* S.encodeEffect(codec)(yield* Amount.from("0.0000001")).pipe(Effect.flip)))
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
        const wei = yield* Amount.fromAtomic(Atomic.Atomic.make("1"), 18)
        assert.strictEqual(yield* S.encodeEffect(S.toCodecJson(Amount.Amount))(wei), "1e-18")
        assert.strictEqual(yield* S.encodeEffect(Amount.AmountFromString)(wei), "0.000000000000000001")
      }),
    )

    it.effect(
      "rejects forged amounts when encoding",
      Effect.fn(function* () {
        const forged = [
          BigDecimal.fromStringUnsafe("-1") as Amount.Amount,
          BigDecimal.make(1n, Decimals.MAX_DECIMALS + 1) as Amount.Amount,
        ]
        for (const amount of forged) {
          assert.isTrue(S.isSchemaError(yield* S.encodeEffect(Amount.AmountFromAtomic(6))(amount).pipe(Effect.flip)))
          assert.isTrue(S.isSchemaError(yield* S.encodeEffect(Amount.AmountFromString)(amount).pipe(Effect.flip)))
        }
      }),
    )
  })

  describe("formatting", () => {
    it.effect(
      "formats nominal amounts",
      Effect.fn(function* () {
        assert.strictEqual(Amount.toString(yield* Amount.from(10)), "10")
        assert.strictEqual(Amount.toString(yield* Amount.from("1.50")), "1.5")
        assert.strictEqual(Amount.toString(yield* Amount.from("0.000001")), "0.000001")
        assert.strictEqual(
          Amount.toString(yield* Amount.fromAtomic(Atomic.Atomic.make("1"), 18)),
          "0.000000000000000001",
        )
        assert.strictEqual(Amount.toString(yield* Amount.from(10n ** 200n)), `1${"0".repeat(200)}`)
        assert.strictEqual(Amount.toString(yield* Amount.from(BigDecimal.make(15n, -2))), "1500")
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
