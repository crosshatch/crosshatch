import { invalidError } from "@crosshatch/util"
import { BigDecimal, Effect, Option, Schema as S, SchemaGetter } from "effect"

import { id } from "./_Proto.ts"
import * as Atomic from "./Atomic.ts"
import * as Decimals from "./Decimals.ts"

/**
 * A non-negative BigDecimal instance whose raw scale is a safe integer between -255 and 255.
 * Carries no asset identity. Use string codecs at external boundaries and enforce input-size
 * limits there; the coefficient is intentionally arbitrary-size. JSON uses plain decimal strings.
 */
export type Amount = typeof Amount.Type
export const Amount = S.BigDecimal.annotate({
  toCodecJson: () =>
    S.link<BigDecimal.BigDecimal>()(S.String, {
      decode: SchemaGetter.transformOrFail((v) => fromString(v).pipe(Effect.mapError((e) => e.issue))),
      encode: SchemaGetter.transformOrFail((v) =>
        fromBigDecimal(v).pipe(
          Effect.map(toString),
          Effect.mapError((e) => e.issue),
        ),
      ),
    }),
})
  .check(
    S.makeFilter(
      (input) =>
        typeof input.value === "bigint" &&
        Object.getPrototypeOf(input) === Object.getPrototypeOf(BigDecimal.make(0n, 0)),
      {
        expected: "a BigDecimal instance with a bigint coefficient",
      },
    ),
    S.makeFilter((input) => Number.isSafeInteger(input.scale) && Math.abs(input.scale) <= Decimals.MAX_DECIMALS, {
      expected: `a BigDecimal with a safe integer scale between -${Decimals.MAX_DECIMALS} and ${Decimals.MAX_DECIMALS}`,
    }),
    S.makeFilter((input) => input.value >= 0n, { expected: "a BigDecimal greater than or equal to 0" }),
  )
  .pipe(S.brand(id("Amount")))

export type AmountInput = bigint | string | BigDecimal.BigDecimal

/** Parses a bigint, decimal string, or `BigDecimal`. */
export const from = (input: AmountInput) =>
  typeof input === "bigint" ? fromBigInt(input) : typeof input === "string" ? fromString(input) : fromBigDecimal(input)

const decodeEffect = S.decodeEffect(Amount, { reportInput: true })
export const fromBigDecimal: (input: BigDecimal.BigDecimal) => Effect.Effect<Amount, S.SchemaError> = (input) =>
  decodeEffect(input).pipe(Effect.flatMap((v) => decodeEffect(BigDecimal.make(v.value, v.scale))))

const fromBigDecimalOption = (input: Option.Option<BigDecimal.BigDecimal>, parentInput: unknown) => {
  const decimal = Option.getOrUndefined(input)
  if (!decimal) {
    return invalidError(parentInput, "an amount that can be parsed into a BigDecimal")
  }
  return fromBigDecimal(decimal)
}

export const fromString = Effect.fnUntraced(function* (input: string) {
  const trimmed = input.trim()
  if (trimmed === "") return yield* invalidError(input, "a non-empty amount string")
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/u.test(trimmed)) {
    return yield* invalidError(input, "an amount that can be parsed into a BigDecimal")
  }
  return yield* fromBigDecimalOption(BigDecimal.fromString(trimmed), input)
})

export const fromBigInt = (input: bigint) => fromBigDecimal(BigDecimal.fromBigInt(input))

/** Converts {@link Atomic} units back to a nominal {@link Amount}, losslessly. */
export const fromAtomic = Effect.fnUntraced(function* (atomic: Atomic.Atomic, decimals: number) {
  const decoded = yield* Decimals.fromNumber(decimals)
  return yield* fromBigDecimal(BigDecimal.make(BigInt(atomic), decoded))
})

/** Renders an {@link Amount} as a minimal decimal string, with trailing fractional zeros removed. */
export const toString = (amount: Amount) => {
  const normalized = BigDecimal.normalize(BigDecimal.make(amount.value, amount.scale))
  if (normalized.scale <= 0) return `${normalized.value}${"0".repeat(-normalized.scale)}`
  const digits = normalized.value.toString()
  if (normalized.scale >= digits.length) {
    return `0.${"0".repeat(normalized.scale - digits.length)}${digits}`
  }
  const split = digits.length - normalized.scale
  return `${digits.slice(0, split)}.${digits.slice(split)}`
}

/** Lossless atomic codec; encoding rejects amounts not exactly representable at the given precision. */
export const AmountFromAtomic = (decimals: number) =>
  Atomic.Atomic.pipe(
    S.decodeTo(Amount, {
      decode: SchemaGetter.transformOrFail((v) => fromAtomic(v, decimals).pipe(Effect.mapError((e) => e.issue))),
      encode: SchemaGetter.transformOrFail((v) =>
        fromBigDecimal(v).pipe(
          Effect.flatMap((v) => Atomic.fromAmount(v, decimals)),
          Effect.mapError((e) => e.issue),
        ),
      ),
    }),
  )

/** Schema codec between decimal strings and {@link Amount}s. */
export const AmountFromString = S.String.pipe(
  S.decodeTo(Amount, {
    decode: SchemaGetter.transformOrFail((v) => fromString(v).pipe(Effect.mapError((e) => e.issue))),
    encode: SchemaGetter.transformOrFail((v) =>
      fromBigDecimal(v).pipe(
        Effect.map(toString),
        Effect.mapError((e) => e.issue),
      ),
    ),
  }),
)

/** Renders an {@link Amount} with exactly `decimals` fraction digits, rejecting precision loss. */
export const display = Effect.fnUntraced(function* (amount: Amount, nDecimals: number) {
  const decimals = yield* Decimals.fromNumber(nDecimals)
  const units = BigInt(yield* Atomic.fromAmount(amount, decimals))
  const scale = 10n ** BigInt(decimals)
  const fraction = decimals === 0 ? "" : `.${(units % scale).toString().padStart(decimals, "0")}`
  return `${units / scale}${fraction}`
})
