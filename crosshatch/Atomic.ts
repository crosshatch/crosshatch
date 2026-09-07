import { invalidError } from "@crosshatch/util"
import { BigDecimal, Effect, Schema as S } from "effect"

import { id } from "./_Proto.ts"
import type * as Amount from "./Amount.ts"
import * as Decimals from "./Decimals.ts"

/**
 * Canonical atomic (smallest-denomination) units, e.g. wei or USDC base units.
 * Carries no asset identity or integer-width limit. Transaction boundaries must select the
 * asset's decimals and enforce its chain-specific maximum; transports must bound input size.
 */
export type Atomic = typeof Atomic.Type
export const Atomic = S.String.check(S.isPattern(/^(?:0|[1-9]\d*)$/u)).pipe(S.brand(id("Atomic")))

const decodeEffect = S.decodeEffect(Atomic, { reportInput: true })
export const fromString = (input: string): Effect.Effect<Atomic, S.SchemaError> => decodeEffect(input)

/** Converts a nominal {@link Amount} to {@link Atomic} units, rejecting any precision loss. */
export const fromAmount = Effect.fnUntraced(function* (amount: Amount.Amount, decimals: number) {
  const scale = yield* Decimals.fromNumber(decimals)
  const nominal = BigDecimal.make(amount.value, amount.scale)
  const rounded = nominal.pipe(
    BigDecimal.round({
      scale,
      mode: "to-zero",
    }),
    BigDecimal.normalize,
    BigDecimal.scale(scale),
  )
  if (!BigDecimal.equals(nominal, BigDecimal.make(rounded.value, scale))) {
    return yield* invalidError(amount, `an amount exactly representable with ${scale} decimal places`)
  }
  return yield* fromString(rounded.value.toString())
})
