import { BigDecimal, Effect, Option, Schema as S, type SchemaAST, SchemaGetter, SchemaIssue } from "effect"

import * as Atomic from "./Atomic.ts"
import * as Decimals from "./Decimals.ts"

/** A non-negative `BigDecimal` with a safe integer scale between -255 and 255. */
export type Amount = typeof Amount.Type
export const Amount = S.BigDecimal.check(
  S.makeFilter((v) => Number.isSafeInteger(v.scale) && Math.abs(v.scale) <= Decimals.MAX_DECIMALS, {
    expected: `a BigDecimal with a safe integer scale between -${Decimals.MAX_DECIMALS} and ${Decimals.MAX_DECIMALS}`,
  }),
  S.isGreaterThanOrEqualToBigDecimal(BigDecimal.fromBigInt(0n)),
).pipe(S.brand("crosshatch/Amount"))

export type AmountInput = number | bigint | string | BigDecimal.BigDecimal

export interface ParseOptions {
  readonly reportInput?: boolean | undefined
}

const decodeAmount = S.decodeEffect(Amount)

const toSchemaParseOptions = (options?: ParseOptions): SchemaAST.ParseOptions | undefined =>
  options?.reportInput === undefined ? undefined : { reportInput: options.reportInput }

/** Parses a finite number, bigint, decimal string, or `BigDecimal`. */
export const from = (input: AmountInput, options?: ParseOptions) =>
  typeof input === "number"
    ? fromNumber(input, options)
    : typeof input === "bigint"
      ? fromBigInt(input, options)
      : typeof input === "string"
        ? fromString(input, options)
        : fromBigDecimal(input, options)

const fail = (input: unknown, expected: string, options?: ParseOptions) =>
  new S.SchemaError(new SchemaIssue.InvalidValue({ expected }, input, toSchemaParseOptions(options)))

export const fromBigDecimal = (input: BigDecimal.BigDecimal, options?: ParseOptions) =>
  decodeAmount(input, toSchemaParseOptions(options))

const fromBigDecimalOption = (input: unknown, option: Option.Option<BigDecimal.BigDecimal>, options?: ParseOptions) => {
  const decimal = Option.getOrUndefined(option)
  if (!decimal) {
    return fail(input, "an amount that can be parsed into a BigDecimal", options)
  }
  return fromBigDecimal(decimal, options)
}

export const fromNumber = (input: number, options?: ParseOptions) =>
  Number.isFinite(input)
    ? fromBigDecimalOption(input, BigDecimal.fromNumber(input), options)
    : fail(input, "a finite number", options)

export const fromString = Effect.fnUntraced(function* (input: string, options?: ParseOptions) {
  const trimmed = input.trim()
  if (trimmed === "") return yield* fail(input, "a non-empty amount string", options)
  return yield* fromBigDecimalOption(input, BigDecimal.fromString(trimmed), options)
})

export const fromBigInt = (input: bigint, options?: ParseOptions) =>
  fromBigDecimal(BigDecimal.fromBigInt(input), options)

/** Converts {@link Atomic} units back to a nominal {@link Amount}, losslessly. */
export const fromAtomic = Effect.fnUntraced(function* (
  atomic: Atomic.Atomic,
  decimals: number,
  options?: ParseOptions,
) {
  const decoded = yield* Decimals.decodeEffect(decimals)
  return yield* fromBigDecimal(BigDecimal.make(BigInt(atomic), decoded), options)
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

/** Schema codec between {@link Atomic} strings and nominal {@link Amount}s for the given unit. */
export const AmountFromAtomic = (decimals: number) =>
  Atomic.Atomic.pipe(
    S.decodeTo(Amount, {
      decode: SchemaGetter.transformOrFail((v, options) =>
        fromAtomic(v, decimals, options).pipe(Effect.mapError((e) => e.issue)),
      ),
      encode: SchemaGetter.transformOrFail((v, options) =>
        fromBigDecimal(v, options).pipe(
          Effect.flatMap((v) => Atomic.fromAmount(v, decimals, options)),
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

/** Renders an {@link Amount} with exactly `decimals` fraction digits, truncating excess precision. */
export const display = Effect.fnUntraced(function* (amount: Amount, nDecimals: number) {
  const decimals = yield* Decimals.decodeEffect(nDecimals)
  const rounded = BigDecimal.normalize(BigDecimal.round(amount, { scale: decimals, mode: "floor" }))
  const units = BigDecimal.scale(rounded, decimals).value
  const scale = 10n ** BigInt(decimals)
  const fraction = decimals === 0 ? "" : `.${(units % scale).toString().padStart(decimals, "0")}`
  return `${units / scale}${fraction}`
})
