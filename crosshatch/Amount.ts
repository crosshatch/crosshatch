import { BigDecimal, Effect, Option, Schema as S, type SchemaAST, SchemaGetter, SchemaIssue } from "effect"

import * as Atomic from "./Atomic.ts"
import * as Decimals from "./Decimals.ts"

/**
 * A non-negative `BigDecimal` with a safe integer scale.
 *
 * In-memory brand. On the wire use {@link AmountFromString} (canonical decimal
 * text) or {@link AmountFromAtomic} (unit-scaled integer string). JSON encoding of this
 * schema uses Effect's `BigDecimal.format`, which switches to scientific
 * notation when `|scale| >= 16`.
 */
export type Amount = typeof Amount.Type
export const Amount = S.BigDecimal.check(
  S.isGreaterThanOrEqualToBigDecimal(BigDecimal.fromBigInt(0n)),
  S.makeFilter((v) => Number.isSafeInteger(v.scale), {
    expected: "a BigDecimal with a safe integer scale",
  }),
).pipe(S.brand("crosshatch/Amount"))

export type AmountInput = number | bigint | string | BigDecimal.BigDecimal

export const fromBigDecimal = S.decodeEffect(Amount)

const fail = (input: unknown, expected: string, options?: SchemaAST.ParseOptions) =>
  new S.SchemaError(new SchemaIssue.InvalidValue({ expected }, input, options))

const fromBigDecimalOption = (
  input: unknown,
  option: Option.Option<BigDecimal.BigDecimal>,
  options?: SchemaAST.ParseOptions,
) => {
  const decimal = Option.getOrUndefined(option)
  if (!decimal) {
    return fail(input, "an amount that can be parsed into a BigDecimal", options)
  }
  return fromBigDecimal(decimal, options)
}

export const fromNumber = Effect.fnUntraced(function* (input: number, options?: SchemaAST.ParseOptions) {
  if (!Number.isFinite(input)) return yield* fail(input, "a finite number", options)
  return yield* fromBigDecimalOption(input, BigDecimal.fromNumber(input), options)
})

export const fromString = Effect.fnUntraced(function* (input: string, options?: SchemaAST.ParseOptions) {
  const trimmed = input.trim()
  if (trimmed === "") return yield* fail(input, "a non-empty amount string", options)
  return yield* fromBigDecimalOption(input, BigDecimal.fromString(trimmed), options)
})

export const fromBigInt = (input: bigint, options?: SchemaAST.ParseOptions) =>
  fromBigDecimal(BigDecimal.fromBigInt(input), options)

/**
 * Parses a finite number, bigint, decimal string, or `BigDecimal`.
 *
 * `number` uses `BigDecimal.fromNumber` (`${n}`), so values that are not
 * already exact in IEEE-754 (e.g. `0.1 + 0.2`) keep binary rounding error, and
 * integers above `Number.MAX_SAFE_INTEGER` lose precision. Prefer `string` or
 * `bigint` for money.
 */
export const from = (input: AmountInput, options?: SchemaAST.ParseOptions) =>
  typeof input === "number"
    ? fromNumber(input, options)
    : typeof input === "bigint"
      ? fromBigInt(input, options)
      : typeof input === "string"
        ? fromString(input, options)
        : fromBigDecimal(input, options)

/** Converts {@link Atomic} units back to a nominal {@link Amount}, losslessly. */
export const fromAtomic = Effect.fnUntraced(function* (atomic: Atomic.Atomic, decimals: number) {
  const decoded = yield* Decimals.decodeEffect(decimals)
  return yield* fromBigDecimal(BigDecimal.make(BigInt(atomic), decoded))
})

/** Renders an {@link Amount} as a minimal decimal string, with trailing fractional zeros removed. */
export const toString = (amount: Amount) => {
  const normalized = BigDecimal.normalize(amount)
  if (normalized.scale <= 0) return `${normalized.value}${"0".repeat(-normalized.scale)}`
  const digits = normalized.value.toString()
  if (normalized.scale >= digits.length) {
    return `0.${"0".repeat(normalized.scale - digits.length)}${digits}`
  }
  const split = digits.length - normalized.scale
  return `${digits.slice(0, split)}.${digits.slice(split)}`
}

/**
 * Schema codec between {@link Atomic} strings and nominal {@link Amount}s for the given unit.
 *
 * Encode rounds with `config.rounding` (default `"ceil"`) when the amount is more precise than the unit,
 * so encode-then-decode is not identity for over-precise values.
 */
export const AmountFromAtomic = (config: Atomic.AtomicConfig) =>
  Atomic.Atomic.pipe(
    S.decodeTo(Amount, {
      decode: SchemaGetter.transformOrFail((v) => fromAtomic(v, config.decimals).pipe(Effect.mapError((e) => e.issue))),
      encode: SchemaGetter.transformOrFail((v, options) =>
        fromBigDecimal(v, options).pipe(
          Effect.flatMap((v) => Atomic.fromAmount(v, config)),
          Effect.mapError((e) => e.issue),
        ),
      ),
    }),
  )

/** Schema codec between decimal strings and {@link Amount}s. */
export const AmountFromString = S.String.pipe(
  S.decodeTo(Amount, {
    decode: SchemaGetter.transformOrFail((v, options) => fromString(v, options).pipe(Effect.mapError((e) => e.issue))),
    encode: SchemaGetter.transformOrFail((v, options) =>
      fromBigDecimal(v, options).pipe(
        Effect.map(toString),
        Effect.mapError((e) => e.issue),
      ),
    ),
  }),
)

/**
 * Renders an {@link Amount} with exactly `decimals` fraction digits, truncating (never rounding up)
 * excess precision, e.g. `1.239` at 2 decimals → `"1.23"`.
 */
export const display = Effect.fnUntraced(function* (amount: Amount, nDecimals: number) {
  const decimals = yield* Decimals.decodeEffect(nDecimals)
  const rounded = BigDecimal.normalize(BigDecimal.round(amount, { scale: decimals, mode: "floor" }))
  const units = BigDecimal.scale(rounded, decimals).value
  const scale = 10n ** BigInt(decimals)
  const fraction = decimals === 0 ? "" : `.${(units % scale).toString().padStart(decimals, "0")}`
  return `${units / scale}${fraction}`
})
