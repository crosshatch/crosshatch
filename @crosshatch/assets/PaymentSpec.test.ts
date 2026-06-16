import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"

import * as Amount from "./Amount.ts"
import { ASSETS } from "./ASSETS.ts"
import * as PaymentSpec from "./PaymentSpec.ts"

describe(import.meta.url, () => {
  it.effect(
    "unwraps a payment spec",
    Effect.fn(function* () {
      const payment = yield* PaymentSpec.unwrap("0.01 eip155:8453 USDC")
      assert.strictEqual(payment.amount, Amount.Usd.make(10_000n))
      assert.strictEqual(payment.asset, ASSETS.BASE_USDC)
    }),
  )

  it.effect(
    "unwraps a non-USDC payment spec",
    Effect.fn(function* () {
      const payment = yield* PaymentSpec.unwrap("1 eip155:4326 MegaUSD")
      assert.strictEqual(payment.amount, Amount.Usd.make(1_000_000n))
      assert.strictEqual(payment.asset, ASSETS.MEGAETH_MEGAUSD)
    }),
  )

  it.effect(
    "rejects malformed payment specs",
    Effect.fn(function* () {
      yield* PaymentSpec.unwrap("0.01 eip155:8453" as PaymentSpec.PaymentSpec).pipe(Effect.flip)
      yield* PaymentSpec.unwrap("0.01 eip155:8453 USDC extra" as PaymentSpec.PaymentSpec).pipe(Effect.flip)
    }),
  )

  it.effect(
    "rejects invalid amounts",
    Effect.fn(function* () {
      yield* PaymentSpec.unwrap("abc eip155:8453 USDC" as PaymentSpec.PaymentSpec).pipe(Effect.flip)
      yield* PaymentSpec.unwrap("-1 eip155:8453 USDC" as PaymentSpec.PaymentSpec).pipe(Effect.flip)
    }),
  )

  it.effect(
    "rejects unknown network and asset combinations",
    Effect.fn(function* () {
      yield* PaymentSpec.unwrap("0.01 eip155:8453 MegaUSD").pipe(Effect.flip)
      yield* PaymentSpec.unwrap("0.01 eip155:1 USDC" as PaymentSpec.PaymentSpec).pipe(Effect.flip)
    }),
  )
})
