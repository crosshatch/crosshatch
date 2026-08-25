import { assert, describe, it } from "@effect/vitest"
import { BigDecimal, Effect, Schema as S } from "effect"

import { Address, Amount, Requirements } from "./index.ts"
import * as Known from "./Known/index.ts"

const assertAmount = (actual: Amount.Amount, expected: string) =>
  assert.isTrue(
    BigDecimal.equals(actual, BigDecimal.fromStringUnsafe(expected)),
    `expected ${BigDecimal.format(actual)} to equal ${expected}`,
  )

describe(import.meta.url, () => {
  it.effect(
    "parses decimal input",
    Effect.fn(function* () {
      assertAmount(yield* Amount.from("10"), "10")
      assertAmount(yield* Amount.from("1.5"), "1.5")
      assertAmount(yield* Amount.from("0.000001"), "0.000001")
    }),
  )

  it.effect(
    "rejects invalid input",
    Effect.fn(function* () {
      yield* Amount.from("").pipe(Effect.flip)
      yield* Amount.from("-1").pipe(Effect.flip)
      yield* Amount.from("not-a-number").pipe(Effect.flip)
      yield* Amount.from("$1").pipe(Effect.flip)
      yield* Amount.from(-1).pipe(Effect.flip)
      yield* Amount.from(Infinity).pipe(Effect.flip)
      yield* Amount.from(NaN).pipe(Effect.flip)
      yield* Amount.from(-1n).pipe(Effect.flip)
    }),
  )

  it.effect(
    "reports why input is invalid",
    Effect.fn(function* () {
      const error = (input: Amount.Input) => Amount.from(input).pipe(Effect.flip)
      assert.match((yield* error("")).message, /non-empty amount string/u)
      assert.match((yield* error("   ")).message, /non-empty amount string/u)
      assert.match((yield* error("not-a-number")).message, /parsed into a BigDecimal/u)
      assert.match((yield* error("-1")).message, /greater than or equal to 0/u)
      assert.match((yield* error(-1n)).message, /greater than or equal to 0/u)
      assert.match((yield* error(NaN)).message, /finite number/u)
      assert.match((yield* error(Infinity)).message, /finite number/u)
    }),
  )

  it.effect(
    "supports asset-defined magnitudes",
    Effect.fn(function* () {
      assertAmount(yield* Amount.from("1e5"), "100000")
      assertAmount(yield* Amount.from("1e65"), `1${"0".repeat(65)}`)
      assertAmount(yield* Amount.from(10n ** 200n), `1${"0".repeat(200)}`)
      yield* S.decodeEffect(Amount.Atomic)(`1${"0".repeat(200)}`)
      yield* S.decodeEffect(Amount.Amount)(BigDecimal.make(10n ** 200n, 0))
      assert.match((yield* Amount.from(BigDecimal.make(15n, 1.5)).pipe(Effect.flip)).message, /safe integer scale/u)
      assert.match((yield* Amount.from(BigDecimal.make(15n, NaN)).pipe(Effect.flip)).message, /safe integer scale/u)
      yield* S.decodeEffect(Amount.Amount)(BigDecimal.make(15n, 1.5)).pipe(Effect.flip)
    }),
  )

  it.effect(
    "converts large atomic values without assuming an asset limit",
    Effect.fn(function* () {
      const atomic = yield* Amount.toAtomic(yield* Amount.from(10n ** 200n), { decimals: 18 })
      assert.strictEqual(atomic, `1${"0".repeat(218)}`)
      yield* S.decodeEffect(Amount.Atomic)(atomic)
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

  it.effect(
    "converts nominal amounts to atomic units",
    Effect.fn(function* () {
      assert.strictEqual(yield* Amount.toAtomic(yield* Amount.from(1), { decimals: 6 }), "1000000")
      assert.strictEqual(yield* Amount.toAtomic(yield* Amount.from(1), { decimals: 18 }), `1${"0".repeat(18)}`)
      assert.strictEqual(yield* Amount.toAtomic(yield* Amount.from(0), { decimals: 6 }), "0")
      assert.strictEqual(yield* Amount.toAtomic(yield* Amount.from("0.0000001"), { decimals: 6 }), "1")
      assert.strictEqual(
        yield* Amount.toAtomic(yield* Amount.from("0.0000001"), { decimals: 6, rounding: "floor" }),
        "0",
      )
    }),
  )

  it.effect(
    "rejects invalid atomic unit decimals",
    Effect.fn(function* () {
      const amount = yield* Amount.from(1)
      const error = <A>(effect: Effect.Effect<A, S.SchemaError>) => effect.pipe(Effect.flip)
      assert.match((yield* error(Amount.toAtomic(amount, { decimals: 1.5 }))).message, /integer/u)
      assert.match((yield* error(Amount.toAtomic(amount, { decimals: -1 }))).message, /greater than or equal to 0/u)
      assertAmount(yield* Amount.fromAtomic(Amount.Atomic.make("1"), { decimals: 65 }), `0.${"0".repeat(64)}1`)
      assert.match((yield* error(Amount.display(amount, -2))).message, /greater than or equal to 0/u)
    }),
  )

  it.effect(
    "converts atomic units to nominal amounts losslessly",
    Effect.fn(function* () {
      assertAmount(yield* Amount.fromAtomic(Amount.Atomic.make("1000000"), { decimals: 6 }), "1")
      assertAmount(yield* Amount.fromAtomic(Amount.Atomic.make("1"), { decimals: 18 }), "0.000000000000000001")
      const original = yield* Amount.from("1.000000000000000001")
      assertAmount(
        yield* Amount.fromAtomic(yield* Amount.toAtomic(original, { decimals: 18 }), { decimals: 18 }),
        "1.000000000000000001",
      )
    }),
  )

  it.effect(
    "round-trips through the atomic schema codec",
    Effect.fn(function* () {
      const codec = Amount.atomic({ decimals: 6 })
      const decoded = yield* S.decodeEffect(codec)(Amount.Atomic.make("1500000"))
      assertAmount(decoded, "1.5")
      assert.strictEqual(yield* S.encodeEffect(codec)(decoded), "1500000")
    }),
  )

  it.effect(
    "round-trips through the string schema codec",
    Effect.fn(function* () {
      const decoded = yield* S.decodeEffect(Amount.AmountFromString)("1.50")
      assertAmount(decoded, "1.5")
      assert.strictEqual(yield* S.encodeEffect(Amount.AmountFromString)(decoded), "1.5")
      yield* S.decodeEffect(Amount.AmountFromString)("-1").pipe(Effect.flip)
      assertAmount(yield* S.decodeEffect(Amount.AmountFromString)("1".repeat(200)), "1".repeat(200))
    }),
  )

  it.effect(
    "formats nominal amounts",
    Effect.fn(function* () {
      assert.strictEqual(Amount.format(yield* Amount.from(10)), "10")
      assert.strictEqual(Amount.format(yield* Amount.from("1.50")), "1.5")
      assert.strictEqual(Amount.format(yield* Amount.from("0.000001")), "0.000001")
    }),
  )

  it.effect(
    "displays amounts at a fixed precision",
    Effect.fn(function* () {
      assert.strictEqual(yield* Amount.display(yield* Amount.from(20), 2), "20.00")
      assert.strictEqual(yield* Amount.display(yield* Amount.from("1.5"), 2), "1.50")
      assert.strictEqual(yield* Amount.display(yield* Amount.from("1.239"), 2), "1.23")
      assert.strictEqual(yield* Amount.display(yield* Amount.from("1.9"), 0), "1")
    }),
  )

  it.effect(
    "scales grouped requirements by physical asset decimals",
    Effect.fn(function* () {
      const payTo = Address.Address.make("0x0000000000000000000000000000000000000001")
      const [sixDecimals] = yield* Requirements.denomination(Known.USD, {
        amount: 0.01,
        recipients: { eip155: { 8453: payTo } },
      })
      assert.strictEqual(sixDecimals!.amount, "10000")
      const [eighteenDecimals] = yield* Requirements.denomination(Known.USD, {
        amount: 0.01,
        recipients: { eip155: { 31612: payTo } },
      })
      assert.strictEqual(eighteenDecimals!.amount, `1${"0".repeat(16)}`)
    }),
  )
})
