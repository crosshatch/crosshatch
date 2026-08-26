import { BigDecimal, Effect, Option, Schema as S, SchemaGetter, SchemaIssue } from "effect"

/** An asset quantity expressed in atomic (smallest-denomination) units, e.g. wei or USDC base units. */
export type Atomic = typeof Atomic.Type

/** Schema for {@link Atomic}: a decimal-digit string with no sign, leading zeros, or exponent. */
export const Atomic = S.String.check(S.isPattern(/^(?:0|[1-9]\d*)$/u)).pipe(S.brand("crosshatch/Atomic"))

/** A non-negative nominal asset quantity, e.g. `1.5` USDC. */
export type Amount = typeof Amount.Type

/** A non-negative `BigDecimal` with a safe integer scale. */
export const Amount = S.BigDecimal.check(
  S.isGreaterThanOrEqualToBigDecimal(BigDecimal.fromBigInt(0n)),
  S.makeFilter((v) => Number.isSafeInteger(v.scale), {
    expected: "a BigDecimal with a safe integer scale",
  }),
).pipe(S.brand("crosshatch/Amount"))

export type Input = number | bigint | string | BigDecimal.BigDecimal

const fail = (input: unknown, expected: string) =>
  new S.SchemaError(new SchemaIssue.InvalidValue({ expected }, input, { reportInput: true }))

export const from = Effect.fnUntraced(function* (input: Input) {
  let decimal: BigDecimal.BigDecimal | undefined
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return yield* fail(input, "a finite number")
    decimal = Option.getOrUndefined(BigDecimal.fromNumber(input))
  } else if (typeof input === "bigint") {
    decimal = BigDecimal.fromBigInt(input)
  } else if (typeof input === "string") {
    const trimmed = input.trim()
    if (trimmed === "") return yield* fail(input, "a non-empty amount string")
    decimal = Option.getOrUndefined(BigDecimal.fromString(trimmed))
  } else {
    decimal = input
  }
  if (decimal === undefined) return yield* fail(input, "an amount that can be parsed into a BigDecimal")
  return yield* S.decodeEffect(Amount)(decimal)
})

/**
 * Upper bound on {@link Decimals}. ERC-20 `decimals` is `uint8`; converting at a
 * larger scale would also make `10n ** BigInt(decimals)` unbounded.
 */
export const MAX_DECIMALS = 255

export type Decimals = typeof Decimals.Type
export const Decimals = S.Natural.check(S.isLessThanOrEqualTo(MAX_DECIMALS)).pipe(S.brand("crosshatch/Decimals"))

const decodeDecimals = S.decodeEffect(Decimals)

/** An asset's atomic denomination: how many decimal places one nominal unit subdivides into. */
export interface AtomicUnit {
  /** Decimal places per nominal unit — a non-negative integer, e.g. 6 for USDC, 18 for ETH. */
  readonly decimals: number
  /** Defaults to `"ceil"` so converting a nominal amount to atomic units never under-collects. */
  readonly rounding?: BigDecimal.RoundingMode | undefined
}

const unscaled = (decimal: BigDecimal.BigDecimal, decimals: Decimals): bigint =>
  decimal.value * 10n ** BigInt(decimals - decimal.scale)

/**
 * Converts a nominal {@link Amount} to {@link Atomic} units, rounding (per `unit.rounding`)
 * when the amount is more precise than the unit allows.
 */
export const toAtomic = Effect.fnUntraced(function* (amount: Amount, unit: AtomicUnit) {
  const decimals = yield* decodeDecimals(unit.decimals)
  const rounded = BigDecimal.normalize(BigDecimal.round(amount, { scale: decimals, mode: unit.rounding ?? "ceil" }))
  return Atomic.make(unscaled(rounded, decimals).toString(), { disableChecks: true })
})

/** Converts {@link Atomic} units back to a nominal {@link Amount}, losslessly. */
export const fromAtomic = Effect.fnUntraced(function* (atomic: Atomic, unit: AtomicUnit) {
  const decimals = yield* decodeDecimals(unit.decimals)
  return yield* S.decodeEffect(Amount)(BigDecimal.make(BigInt(atomic), decimals))
})

/**
 * Schema codec between {@link Atomic} strings and nominal {@link Amount}s for the given unit.
 *
 * Encode rounds with `unit.rounding ?? "ceil"` when the amount is more precise than the unit,
 * so encode-then-decode is not identity for over-precise values.
 */
export const atomic = (unit: AtomicUnit) =>
  Atomic.pipe(
    S.decodeTo(Amount, {
      decode: SchemaGetter.transformOrFail((value) => fromAtomic(value, unit).pipe(Effect.mapError((v) => v.issue))),
      encode: SchemaGetter.transformOrFail((value) =>
        toAtomic(Amount.make(value, { disableChecks: true }), unit).pipe(Effect.mapError((v) => v.issue)),
      ),
    }),
  )

/** Renders an {@link Amount} as a minimal decimal string, with trailing fractional zeros removed. */
export const format = (amount: Amount): string => {
  const normalized = BigDecimal.normalize(amount)
  if (normalized.scale <= 0) return `${normalized.value}${"0".repeat(-normalized.scale)}`
  const digits = normalized.value.toString()
  if (normalized.scale >= digits.length) {
    return `0.${"0".repeat(normalized.scale - digits.length)}${digits}`
  }
  const split = digits.length - normalized.scale
  return `${digits.slice(0, split)}.${digits.slice(split)}`
}

/** Schema codec between decimal strings and {@link Amount}s. */
export const AmountFromString = S.String.pipe(
  S.decodeTo(Amount, {
    decode: SchemaGetter.transformOrFail((value) => from(value).pipe(Effect.mapError((v) => v.issue))),
    encode: SchemaGetter.transform((value) => format(Amount.make(value, { disableChecks: true }))),
  }),
)

/**
 * Renders an {@link Amount} with exactly `decimals` fraction digits, truncating (never rounding up)
 * excess precision, e.g. `1.239` at 2 decimals → `"1.23"`.
 */
export const display = Effect.fnUntraced(function* (amount: Amount, decimalsInput: number) {
  const decimals = yield* decodeDecimals(decimalsInput)
  const rounded = BigDecimal.normalize(BigDecimal.round(amount, { scale: decimals, mode: "floor" }))
  const units = unscaled(rounded, decimals)
  const scale = 10n ** BigInt(decimals)
  const fraction = decimals === 0 ? "" : `.${(units % scale).toString().padStart(decimals, "0")}`
  return `${units / scale}${fraction}`
})
