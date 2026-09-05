import { invalidError } from "@crosshatch/util"
import { BigDecimal, Effect, Option, Schema as S, SchemaGetter } from "effect"

import { id } from "./_Proto.ts"
import * as Atomic from "./Atomic.ts"
import * as Decimals from "./Decimals.ts"

/** A non-negative `BigDecimal` whose raw scale is a safe integer between -255 and 255. */
export type Amount = typeof Amount.Type
export const Amount = S.BigDecimal.check(
  S.makeFilter((input) => Number.isSafeInteger(input.scale) && Math.abs(input.scale) <= Decimals.MAX_DECIMALS, {
    expected: `a BigDecimal with a safe integer scale between -${Decimals.MAX_DECIMALS} and ${Decimals.MAX_DECIMALS}`,
  }),
  S.isGreaterThanOrEqualToBigDecimal(BigDecimal.fromBigInt(0n)),
).pipe(S.brand(id("Amount")))

export type AmountInput = number | bigint | string | BigDecimal.BigDecimal

/** Parses a finite number, bigint, decimal string, or `BigDecimal`. */
export const from = (input: AmountInput) =>
  typeof input === "number"
    ? fromNumber(input)
    : typeof input === "bigint"
      ? fromBigInt(input)
      : typeof input === "string"
        ? fromString(input)
        : fromBigDecimal(input)

const decodeEffect = S.decodeEffect(Amount, { reportInput: true })
export const fromBigDecimal: (input: BigDecimal.BigDecimal) => Effect.Effect<Amount, S.SchemaError> = (input) =>
  decodeEffect(input)

const fromBigDecimalOption = (input: Option.Option<BigDecimal.BigDecimal>, parentInput: unknown) => {
  const decimal = Option.getOrUndefined(input)
  if (!decimal) {
    return invalidError(parentInput, "an amount that can be parsed into a BigDecimal")
  }
  return fromBigDecimal(decimal)
}

export const fromNumber = (input: number) =>
  Number.isFinite(input)
    ? fromBigDecimalOption(BigDecimal.fromNumber(input), input)
    : invalidError(input, "a finite number")

export const fromString = Effect.fnUntraced(function* (input: string) {
  const trimmed = input.trim()
  if (trimmed === "") return yield* invalidError(input, "a non-empty amount string")
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

/** Renders an {@link Amount} with exactly `decimals` fraction digits, truncating excess precision. */
export const display = Effect.fnUntraced(function* (amount: Amount, nDecimals: number) {
  const decimals = yield* Decimals.fromNumber(nDecimals)
  const rounded = BigDecimal.normalize(BigDecimal.round(amount, { scale: decimals, mode: "floor" }))
  const units = BigDecimal.scale(rounded, decimals).value
  const scale = 10n ** BigInt(decimals)
  const fraction = decimals === 0 ? "" : `.${(units % scale).toString().padStart(decimals, "0")}`
  return `${units / scale}${fraction}`
})
