import { BigDecimal, Effect, Schema as S } from "effect"

import type * as Amount from "./Amount.ts"
import * as Decimals from "./Decimals.ts"

/** An asset quantity expressed in atomic (smallest-denomination) units, e.g. wei or USDC base units. */
export type Atomic = typeof Atomic.Type
export const Atomic = S.String.check(S.isPattern(/^(?:0|[1-9]\d*)$/u)).pipe(S.brand("crosshatch/Atomic"))

export const decodeEffect = S.decodeEffect(Atomic)

/** An asset's atomic denomination: how many decimal places one nominal unit subdivides into. */
export interface AtomicConfig {
  /** Decimal places per nominal unit — a non-negative integer, e.g. 6 for USDC, 18 for ETH. */
  readonly decimals: number
  /** Defaults to `"ceil"` so converting a nominal amount to atomic units never under-collects. */
  readonly rounding?: BigDecimal.RoundingMode | undefined
}

/**
 * Converts a nominal {@link Amount} to {@link Atomic} units, rounding (per `config.rounding`)
 * when the amount is more precise than the unit allows.
 */
export const fromAmount = Effect.fnUntraced(function* (amount: Amount.Amount, config: AtomicConfig) {
  const scale = yield* Decimals.decodeEffect(config.decimals)
  const rounded = amount.pipe(
    BigDecimal.round({
      scale,
      mode: config.rounding ?? "ceil",
    }),
    BigDecimal.normalize,
    BigDecimal.scale(scale),
  )
  return yield* decodeEffect(rounded.value.toString())
})
