import { BigDecimal, Effect, Schema as S, SchemaIssue } from "effect"

import type * as Amount from "./Amount.ts"
import * as Decimals from "./Decimals.ts"

/**
 * An asset quantity expressed in canonical atomic (smallest-denomination) units, e.g. wei or USDC base units.
 * Scheme-specific decimal wire amounts, such as XRPL IOUs, require a different schema.
 */
export type Atomic = typeof Atomic.Type
export const Atomic = S.String.check(S.isPattern(/^(?:0|[1-9]\d*)$/u)).pipe(S.brand("crosshatch/Atomic"))

export const decodeEffect = S.decodeEffect(Atomic)

/**
 * Converts a nominal {@link Amount} to {@link Atomic} units, truncating excess
 * precision and rejecting non-zero amounts smaller than one atomic unit.
 */
export const fromAmount = Effect.fnUntraced(function* (
  amount: Amount.Amount,
  decimals: number,
  options?: Amount.ParseOptions,
) {
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
    const parseOptions = options?.reportInput === undefined ? undefined : { reportInput: options.reportInput }
    return yield* new S.SchemaError(
      new SchemaIssue.InvalidValue(
        { expected: `an amount representable with ${scale} decimal places` },
        amount,
        parseOptions,
      ),
    )
  }
  return yield* decodeEffect(rounded.value.toString())
})
