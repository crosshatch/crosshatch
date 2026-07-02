import { assert, describe, it } from "@effect/vitest"
import { BigDecimal, Effect, Schema as S } from "effect"

import { Address } from "./Address.ts"
import * as Amount from "./Amount.ts"
import { KnownAsset } from "./index.ts"
import { group } from "./Requirements.ts"

const assertAmount = (actual: typeof Amount.Amount.Type, expected: string) =>
  assert.isTrue(
    BigDecimal.equals(actual, BigDecimal.fromStringUnsafe(expected)),
    `expected ${BigDecimal.format(actual)} to equal ${expected}`,
  )

describe(import.meta.url, () => {
  it.effect(
    "parses decimal input",
    Effect.fn(function* () {
      assertAmount(yield* Amount.parse("10"), "10")
      assertAmount(yield* Amount.parse("1.5"), "1.5")
      assertAmount(yield* Amount.parse("0.000001"), "0.000001")
    }),
  )

  it.effect(
    "rejects invalid input",
    Effect.fn(function* () {
      yield* Amount.parse("").pipe(Effect.flip)
      yield* Amount.parse("-1").pipe(Effect.flip)
      yield* Amount.parse("not-a-number").pipe(Effect.flip)
      yield* Amount.parse("$1").pipe(Effect.flip)
      yield* Amount.from(-1).pipe(Effect.flip)
      yield* Amount.from(Infinity).pipe(Effect.flip)
      yield* Amount.from(NaN).pipe(Effect.flip)
      yield* Amount.from(-1n).pipe(Effect.flip)
    }),
  )

  it("constructs from numbers, bigints, strings, and decimals", () => {
    assertAmount(Amount.fromUnsafe(0.01), "0.01")
    assertAmount(Amount.fromUnsafe(10n), "10")
    assertAmount(Amount.fromUnsafe("1.5"), "1.5")
    assertAmount(Amount.fromUnsafe(BigDecimal.fromStringUnsafe("2.5")), "2.5")
    assert.throws(() => Amount.fromUnsafe(-0.01), Amount.InvalidAmountError)
  })

  it("converts nominal amounts to atomic units", () => {
    assert.strictEqual(Amount.toAtomic(Amount.fromUnsafe(1), { decimals: 6 }), "1000000")
    assert.strictEqual(Amount.toAtomic(Amount.fromUnsafe(1), { decimals: 18 }), `1${"0".repeat(18)}`)
    assert.strictEqual(Amount.toAtomic(Amount.fromUnsafe(0), { decimals: 6 }), "0")
    assert.strictEqual(Amount.toAtomic(Amount.fromUnsafe("0.0000001"), { decimals: 6 }), "1")
    assert.strictEqual(Amount.toAtomic(Amount.fromUnsafe("0.0000001"), { decimals: 6, rounding: "floor" }), "0")
  })

  it("converts atomic units to nominal amounts losslessly", () => {
    assertAmount(Amount.fromAtomic(Amount.Atomic.make("1000000"), { decimals: 6 }), "1")
    assertAmount(Amount.fromAtomic(Amount.Atomic.make("1"), { decimals: 18 }), "0.000000000000000001")
    const original = Amount.fromUnsafe("1.000000000000000001")
    assertAmount(
      Amount.fromAtomic(Amount.toAtomic(original, { decimals: 18 }), { decimals: 18 }),
      "1.000000000000000001",
    )
  })

  it.effect(
    "round-trips through the atomic schema codec",
    Effect.fn(function* () {
      const codec = Amount.atomic({ decimals: 6 })
      const decoded = yield* S.decodeEffect(codec)(Amount.Atomic.make("1500000"))
      assertAmount(decoded, "1.5")
      assert.strictEqual(yield* S.encodeEffect(codec)(decoded), "1500000")
    }),
  )

  it("formats nominal amounts", () => {
    assert.strictEqual(Amount.format(Amount.fromUnsafe(10)), "10")
    assert.strictEqual(Amount.format(Amount.fromUnsafe("1.50")), "1.5")
    assert.strictEqual(Amount.format(Amount.fromUnsafe("0.000001")), "0.000001")
  })

  it("displays amounts at a fixed precision", () => {
    assert.strictEqual(Amount.display(Amount.fromUnsafe(20), 2), "20.00")
    assert.strictEqual(Amount.display(Amount.fromUnsafe("1.5"), 2), "1.50")
    assert.strictEqual(Amount.display(Amount.fromUnsafe("1.239"), 2), "1.23")
    assert.strictEqual(Amount.display(Amount.fromUnsafe("1.9"), 0), "1")
  })

  it("scales grouped requirements by deployment decimals", () => {
    const payTo = Address.make("0x0000000000000000000000000000000000000001")
    const [sixDecimals] = group(KnownAsset.USDC, { amount: 0.01, recipients: { eip155: { 8453: payTo } } })
    assert.strictEqual(sixDecimals!.amount, "10000")
    const [eighteenDecimals] = group(KnownAsset.MUSD, { amount: 0.01, recipients: { eip155: { 31612: payTo } } })
    assert.strictEqual(eighteenDecimals!.amount, `1${"0".repeat(16)}`)
  })
})
