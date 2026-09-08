import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema as S } from "effect"

import * as Decimals from "./Decimals.ts"

describe(import.meta.url, () => {
  it.effect(
    "accepts 0 through MAX_DECIMALS",
    Effect.fn(function* () {
      assert.strictEqual(yield* Decimals.fromNumber(0), 0)
      assert.strictEqual(yield* Decimals.fromNumber(Decimals.MAX_DECIMALS), Decimals.MAX_DECIMALS)
    }),
  )

  it.effect(
    "rejects values outside 0 through MAX_DECIMALS",
    Effect.fn(function* () {
      for (const decimals of [-1, 1.5, NaN, Infinity, Decimals.MAX_DECIMALS + 1, Number.MAX_SAFE_INTEGER]) {
        assert.isTrue(S.isSchemaError(yield* Effect.flip(Decimals.fromNumber(decimals))))
      }
    }),
  )

  it.effect(
    "rejects forged decimals when encoding",
    Effect.fn(function* () {
      for (const value of [-1, 1.5, Decimals.MAX_DECIMALS + 1]) {
        assert.isTrue(
          S.isSchemaError(yield* S.encodeEffect(Decimals.Decimals)(value as Decimals.Decimals).pipe(Effect.flip)),
        )
      }
    }),
  )
})
