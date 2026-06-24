import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"

import * as Amount from "./Amount.ts"
import type { Deployment } from "./PhysicalAsset.ts"

const EXAMPLE = { decimals: 6 } as never as Deployment

describe(import.meta.url, () => {
  it.effect(
    "parses decimal dollar input as micros",
    Effect.fn(function* () {
      assert.strictEqual(yield* Amount.parseUsd("10"), Amount.Usd.make(10_000_000n))
      assert.strictEqual(yield* Amount.parseUsd("1.5"), Amount.Usd.make(1_500_000n))
      assert.strictEqual(yield* Amount.parseUsd("0.000001"), Amount.Usd.make(1n))
    }),
  )

  it.effect(
    "rejects invalid dollar input",
    Effect.fn(function* () {
      yield* Amount.parseUsd("").pipe(Effect.flip)
      yield* Amount.parseUsd("-1").pipe(Effect.flip)
      yield* Amount.parseUsd("1.0000001").pipe(Effect.flip)
      yield* Amount.parseUsd("not-a-number").pipe(Effect.flip)
    }),
  )

  it("formats micros as dollars", () => {
    assert.strictEqual(Amount.formatUsd(Amount.Usd.make(10_000_000n)), "10")
    assert.strictEqual(Amount.formatUsd(Amount.Usd.make(1_500_000n)), "1.5")
    assert.strictEqual(Amount.formatUsd(Amount.Usd.make(1n)), "0.000001")
  })

  it("displays micros as fixed dollar amounts", () => {
    assert.strictEqual(Amount.displayUsd(Amount.Usd.make(20_000_000n)), "$20.0000")
    assert.strictEqual(Amount.displayUsd(Amount.Usd.make(1_500_000n)), "$1.5000")
    assert.strictEqual(Amount.displayUsd(Amount.Usd.make(1n)), "$0.0000")
    assert.strictEqual(Amount.displayUsd(Amount.Usd.make(1_234_567n)), "$1.2345")
  })

  it("converts atomic units using ceiling micros", () => {
    assert.strictEqual(Amount.atomicToUsd(Amount.Atomic.make("1000000"), EXAMPLE), Amount.Usd.make(1_000_000n))
    assert.strictEqual(Amount.atomicToUsd(Amount.Atomic.make("1"), EXAMPLE), Amount.Usd.make(1n))
  })

  it("converts micros to atomic units using ceiling units", () => {
    const wholeDollars = { ...EXAMPLE, decimals: 0 }
    assert.strictEqual(Amount.usdToAtomic(Amount.Usd.make(1_000_000n), EXAMPLE), Amount.Atomic.make("1000000"))
    assert.strictEqual(Amount.usdToAtomic(Amount.Usd.make(1000n), EXAMPLE), Amount.Atomic.make("1000"))
    assert.strictEqual(Amount.usdToAtomic(Amount.Usd.make(1n), wholeDollars), Amount.Atomic.make("1"))
  })
})
