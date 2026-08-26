import { assert, describe, it } from "@effect/vitest"
import { BigDecimal, Effect, Schema as S } from "effect"

import { Address, Amount, Requirements } from "./index.ts"
import * as Known from "./Known/index.ts"

const assertAmount = (actual: Amount.Amount, expected: string) =>
  assert.isTrue(
    BigDecimal.equals(actual, BigDecimal.fromStringUnsafe(expected)),
    `expected ${BigDecimal.format(actual)} to equal ${expected}`,
  )

const schemaError = <A>(effect: Effect.Effect<A, S.SchemaError>) => effect.pipe(Effect.flip)

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
      for (const input of ["", "-1", "not-a-number", "$1", -1, Infinity, NaN, -1n] as const) {
        assert.isTrue(S.isSchemaError(yield* Amount.from(input).pipe(Effect.flip)))
      }
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
        (yield* schemaError(BigDecimal.make(15n, Number.MAX_SAFE_INTEGER + 1).pipe(S.decodeEffect(Amount.Amount))))
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
        assert.isTrue(S.isSchemaError(yield* schemaError(S.decodeEffect(Amount.Atomic)(input))))
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
      assert.strictEqual(yield* Amount.toAtomic(yield* Amount.from("1.0000001"), { decimals: 6 }), "1000001")
      assert.strictEqual(yield* Amount.toAtomic(yield* Amount.from("1.000001"), { decimals: 6 }), "1000001")
      assert.strictEqual(yield* Amount.toAtomic(yield* Amount.from("0.9999991"), { decimals: 6 }), "1000000")
      assert.strictEqual(
        yield* Amount.toAtomic(yield* Amount.from("1.0000005"), { decimals: 6, rounding: "half-even" }),
        "1000000",
      )
    }),
  )

  it.effect(
    "validates decimal precision across public APIs",
    Effect.fn(function* () {
      const amount = yield* Amount.from(1)
      const atomic = Amount.Atomic.make("1")
      for (const decimals of [-1, 1.5, NaN, Infinity] as const) {
        assert.isTrue(S.isSchemaError(yield* schemaError(Amount.toAtomic(amount, { decimals }))))
        assert.isTrue(S.isSchemaError(yield* schemaError(Amount.fromAtomic(atomic, { decimals }))))
        assert.isTrue(S.isSchemaError(yield* schemaError(Amount.display(amount, decimals))))
        assert.isTrue(S.isSchemaError(yield* schemaError(S.decodeEffect(Amount.atomic({ decimals }))(atomic))))
        assert.isTrue(S.isSchemaError(yield* schemaError(amount.pipe(S.encodeEffect(Amount.atomic({ decimals }))))))
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
    "converts atomic units to nominal amounts losslessly",
    Effect.fn(function* () {
      assertAmount(yield* Amount.fromAtomic(Amount.Atomic.make("1000000"), { decimals: 6 }), "1")
      assertAmount(yield* Amount.fromAtomic(Amount.Atomic.make("1"), { decimals: 18 }), "0.000000000000000001")
      const original = Amount.Atomic.make(`1${"0".repeat(200)}1`)
      const nominal = yield* Amount.fromAtomic(original, { decimals: 18 })
      assert.strictEqual(yield* Amount.toAtomic(nominal, { decimals: 18 }), original)
    }),
  )

  it.effect(
    "round-trips through the atomic schema codec",
    Effect.fn(function* () {
      const codec = Amount.atomic({ decimals: 6 })
      const decoded = yield* S.decodeEffect(codec)(Amount.Atomic.make("1500000"))
      assertAmount(decoded, "1.5")
      assert.strictEqual(yield* S.encodeEffect(codec)(decoded), "1500000")
      assert.isTrue(S.isSchemaError(yield* schemaError(S.decodeEffect(codec)("01"))))
      assert.strictEqual(yield* S.encodeEffect(codec)(yield* Amount.from("1.0000001")), "1000001")
    }),
  )

  it.effect(
    "round-trips through the string schema codec",
    Effect.fn(function* () {
      const decoded = yield* S.decodeEffect(Amount.AmountFromString)("1.50")
      assertAmount(decoded, "1.5")
      assert.strictEqual(yield* S.encodeEffect(Amount.AmountFromString)(decoded), "1.5")
      assert.isTrue(S.isSchemaError(yield* schemaError(S.decodeEffect(Amount.AmountFromString)("-1"))))
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
      assert.strictEqual(yield* Amount.display(yield* Amount.from(0), 2), "0.00")
      assert.strictEqual(yield* Amount.display(yield* Amount.from("0.001"), 2), "0.00")
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
      assert.isDefined(sixDecimals)
      assert.strictEqual(sixDecimals.amount, "10000")
      const [eighteenDecimals] = yield* Requirements.denomination(Known.USD, {
        amount: 0.01,
        recipients: { eip155: { 31612: payTo } },
      })
      assert.isDefined(eighteenDecimals)
      assert.strictEqual(eighteenDecimals.amount, `1${"0".repeat(16)}`)
    }),
  )
})
