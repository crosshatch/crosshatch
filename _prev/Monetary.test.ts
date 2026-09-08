import { assert, describe, it } from "@effect/vitest"
import { BigDecimal, Effect, Schema as S } from "effect"
import { FastCheck } from "effect/testing"

import * as Amount from "./Amount.ts"
import * as Atomic from "./Atomic.ts"

const coefficient = FastCheck.oneof(
  FastCheck.constantFrom(0n, 1n, 10n, 10n ** 256n),
  FastCheck.bigInt({ min: 0n, max: 10n ** 200n }),
)
const decimals = FastCheck.oneof(FastCheck.constantFrom(0, 255), FastCheck.integer({ min: 0, max: 255 }))
const raw = FastCheck.record({
  value: coefficient,
  scale: FastCheck.oneof(FastCheck.constantFrom(-255, 0, 255), FastCheck.integer({ min: -255, max: 255 })),
  trailingZeros: FastCheck.integer({ min: 0, max: 32 }),
}).map(({ scale, trailingZeros, value }) => BigDecimal.make(value * 10n ** BigInt(trailingZeros), scale))
const options = { fastCheck: { numRuns: 500 } }

// Express the amount in atomic units as an integer ratio, independently of BigDecimal rounding.
const atomicRatio = (amount: BigDecimal.BigDecimal, precision: number) => {
  const shift = precision - amount.scale
  return {
    numerator: amount.value * 10n ** BigInt(Math.max(shift, 0)),
    denominator: 10n ** BigInt(Math.max(-shift, 0)),
  }
}

describe(import.meta.url, () => {
  it.effect.prop(
    "round-trips generated canonical atomic strings at precisions 0 through 255",
    { value: coefficient, decimals },
    Effect.fn(function* ({ decimals, value }) {
      const atomic = yield* Atomic.fromString(value.toString())
      const amount = yield* Amount.fromAtomic(atomic, decimals)
      assert.strictEqual(yield* Atomic.fromAmount(amount, decimals), atomic)
    }),
    options,
  )

  it.effect.prop(
    "round-trips raw scales and trailing-zero coefficients through plain strings and JSON numerically",
    { raw },
    Effect.fn(function* ({ raw }) {
      const amount = yield* Amount.fromBigDecimal(raw)
      const text = Amount.toString(amount)
      assert.match(text, /^(?:0|[1-9]\d*)(?:\.\d*[1-9])?$/u)
      assert.isTrue(BigDecimal.equals(raw, yield* Amount.fromString(text)))
      const codec = S.toCodecJson(Amount.Amount)
      const encoded = yield* S.encodeEffect(codec)(amount)
      assert.strictEqual(encoded, text)
      const decoded = yield* S.decodeEffect(codec)(encoded)
      assert.isTrue(BigDecimal.equals(raw, decoded))
    }),
    options,
  )

  it.effect.prop(
    "atomic codec rejects iff the amount is not exactly representable",
    { raw, decimals },
    Effect.fn(function* ({ decimals, raw }) {
      const amount = yield* Amount.fromBigDecimal(raw)
      const { denominator, numerator } = atomicRatio(raw, decimals)
      const units = numerator / denominator
      const codec = Amount.AmountFromAtomic(decimals)
      const result = S.encodeEffect(codec)(amount)
      if (numerator % denominator === 0n) {
        const atomic = yield* result
        assert.strictEqual(atomic, units.toString())
        assert.isTrue(BigDecimal.equals(amount, yield* S.decodeEffect(codec)(atomic)))
      } else {
        const error = yield* Effect.flip(result)
        assert.isTrue(S.isSchemaError(error))
        assert.include(error.message, `exactly representable with ${decimals} decimal places`)
      }
    }),
    options,
  )

  it.effect.prop(
    "atomic conversion rejects iff the amount is not exactly representable",
    { raw, decimals },
    Effect.fn(function* ({ decimals, raw }) {
      const amount = yield* Amount.fromBigDecimal(raw)
      const { denominator, numerator } = atomicRatio(raw, decimals)
      const result = Atomic.fromAmount(amount, decimals)
      if (numerator % denominator === 0n) {
        assert.strictEqual(yield* result, (numerator / denominator).toString())
      } else {
        const error = yield* Effect.flip(result)
        assert.isTrue(S.isSchemaError(error))
        assert.include(error.message, `exactly representable with ${decimals} decimal places`)
      }
    }),
    options,
  )

  it.effect.prop(
    "displays exact fixed digits iff the amount is exactly representable",
    { raw, decimals },
    Effect.fn(function* ({ decimals, raw }) {
      const amount = yield* Amount.fromBigDecimal(raw)
      const { denominator, numerator } = atomicRatio(raw, decimals)
      const result = Amount.display(amount, decimals)
      if (numerator % denominator !== 0n) {
        const error = yield* Effect.flip(result)
        assert.isTrue(S.isSchemaError(error))
        assert.include(error.message, `exactly representable with ${decimals} decimal places`)
        return
      }
      const displayed = yield* result
      assert.match(
        displayed,
        decimals === 0 ? /^(?:0|[1-9]\d*)$/u : new RegExp(`^(?:0|[1-9]\\d*)\\.\\d{${decimals}}$`, "u"),
      )
      assert.strictEqual(BigInt(displayed.replace(".", "")), numerator / denominator)
      assert.isTrue(BigDecimal.equals(yield* Amount.fromString(displayed), amount))
    }),
    options,
  )

  it.effect(
    "rejects a plain object carrying the BigDecimal marker directly",
    Effect.fn(function* () {
      const fake = { "~effect/BigDecimal": "~effect/BigDecimal", value: 1n, scale: 0 }
      assert.isTrue(BigDecimal.isBigDecimal(fake))
      assert.isFalse(S.is(Amount.Amount)(fake))
      assert.isTrue(S.isSchemaError(yield* S.decodeUnknownEffect(Amount.Amount)(fake).pipe(Effect.flip)))
      if (BigDecimal.isBigDecimal(fake)) {
        assert.isTrue(S.isSchemaError(yield* Amount.fromBigDecimal(fake).pipe(Effect.flip)))
      }
    }),
  )

  it.effect.prop(
    "fromBigDecimal rebuilds the raw value without trusting a poisoned normalized cache",
    { raw },
    Effect.fn(function* ({ raw }) {
      const expected = BigDecimal.make(raw.value, raw.scale)
      Object.assign(raw, { normalized: BigDecimal.make(-1n, 0) })
      const amount = yield* Amount.fromBigDecimal(raw)
      assert.notStrictEqual(amount, raw)
      assert.strictEqual(amount.value, raw.value)
      assert.strictEqual(amount.scale, raw.scale)
      assert.isTrue(BigDecimal.equals(amount, expected))
      const parsed = yield* amount.pipe(Amount.toString, Amount.fromString)
      assert.isTrue(BigDecimal.equals(parsed, expected))
    }),
    options,
  )
})
