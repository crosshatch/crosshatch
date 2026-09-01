import { invalidError } from "@crosshatch/util"
import { BigDecimal, Effect, Schema as S } from "effect"

import type * as Amount from "./Amount.ts"
import * as Decimals from "./Decimals.ts"

/** An asset quantity expressed in canonical atomic (smallest-denomination) units, e.g. wei or USDC base units. */
export type Atomic = typeof Atomic.Type
export const Atomic = S.String.check(S.isPattern(/^(?:0|[1-9]\d*)$/u)).pipe(S.brand("crosshatch/Atomic"))

export const decodeEffect = S.decodeEffect(Atomic)

/**
 * Converts a nominal {@link Amount} to {@link Atomic} units, truncating excess
 * precision and rejecting non-zero amounts smaller than one atomic unit.
 */
export const fromAmount = Effect.fnUntraced(function* (amount: Amount.Amount, decimals: number) {
  const scale = yield* Decimals.decodeEffect(decimals)
  const rounded = amount.pipe(
    BigDecimal.round({
      scale,
      mode: "to-zero",
    }),
    BigDecimal.normalize,
    BigDecimal.scale(scale),
  )
  if (amount.value !== 0n && rounded.value === 0n) {
    return yield* invalidError(amount, `an amount representable with ${scale} decimal places`)
  }
  return yield* decodeEffect(rounded.value.toString())
})
