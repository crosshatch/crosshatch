import { AccountAddress, ChainIdString } from "@crosshatch/caip"
import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"

import { parseInput, Micros, format, display, fromX402 } from "./Micros.ts"

describe(import.meta.url, () => {
  it.effect(
    "parses decimal dollar input as micros",
    Effect.fn(function* () {
      assert.strictEqual(yield* parseInput("10"), Micros.make(10_000_000n))
      assert.strictEqual(yield* parseInput("1.5"), Micros.make(1_500_000n))
      assert.strictEqual(yield* parseInput("0.000001"), Micros.make(1n))
    }),
  )

  it.effect(
    "rejects invalid dollar input",
    Effect.fn(function* () {
      yield* parseInput("").pipe(Effect.flip)
      yield* parseInput("-1").pipe(Effect.flip)
      yield* parseInput("1.0000001").pipe(Effect.flip)
      yield* parseInput("not-a-number").pipe(Effect.flip)
    }),
  )

  it("formats micros as dollars", () => {
    assert.strictEqual(format(Micros.make(10_000_000n)), "10")
    assert.strictEqual(format(Micros.make(1_500_000n)), "1.5")
    assert.strictEqual(format(Micros.make(1n)), "0.000001")
  })

  it("displays micros as fixed dollar amounts", () => {
    assert.strictEqual(display(Micros.make(20_000_000n)), "$20.0000")
    assert.strictEqual(display(Micros.make(1_500_000n)), "$1.5000")
    assert.strictEqual(display(Micros.make(1n)), "$0.0000")
    assert.strictEqual(display(Micros.make(1_234_567n)), "$1.2345")
  })

  it("converts x402 base units using ceiling micros", () => {
    const asset = {
      network: ChainIdString.make("eip155:1"),
      asset: AccountAddress.make("0xabc"),
      decimals: 6,
      rpcs: [],
    }
    assert.strictEqual(fromX402("1000000", asset), Micros.make(1_000_000n))
    assert.strictEqual(fromX402("1", asset), Micros.make(1n))
  })
})
