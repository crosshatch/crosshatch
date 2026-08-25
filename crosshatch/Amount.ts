import { BigDecimal, Effect, Option, Schema as S, SchemaGetter, SchemaIssue } from "effect"

/** An asset quantity expressed in atomic (smallest-denomination) units, e.g. wei or USDC base units. */
export type Atomic = typeof Atomic.Type

/** Schema for {@link Atomic}: a decimal-digit string with no sign, leading zeros, or exponent. */
export const Atomic = S.String.check(S.isPattern(/^(?:0|[1-9]\d*)$/u)).pipe(S.brand("crosshatch/Atomic"))

/** A non-negative nominal asset quantity, e.g. `1.5` USDC. */
export type Amount = typeof Amount.Type

/** A non-negative `BigDecimal` with an integral scale. */
export const Amount = S.BigDecimal.check(
  S.isGreaterThanOrEqualToBigDecimal(BigDecimal.fromBigInt(0n)),
  S.makeFilter((v) => (Number.isSafeInteger(v.scale) ? undefined : "Expected a BigDecimal with a safe integer scale")),
).pipe(S.brand("crosshatch/Amount"))

export type Input = number | bigint | string | BigDecimal.BigDecimal

const fail = (input: unknown, message: string) => new S.SchemaError(new SchemaIssue.InvalidValue({ message }, input))

/** Construct an {@link Amount} from a number, bigint, string, or `BigDecimal`. */
export const from = Effect.fnUntraced(function* (input: Input) {
  let decimal: BigDecimal.BigDecimal | undefined
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return yield* fail(input, "Expected a finite number")
    decimal = Option.getOrUndefined(BigDecimal.fromNumber(input))
  } else if (typeof input === "bigint") {
    decimal = BigDecimal.fromBigInt(input)
  } else if (typeof input === "string") {
    const trimmed = input.trim()
    if (trimmed === "") return yield* fail(input, "Expected a non-empty amount string")
    decimal = Option.getOrUndefined(BigDecimal.fromString(trimmed))
  } else {
    decimal = input
  }
  if (!decimal) return yield* fail(input, "Expected an amount that can be parsed into a BigDecimal")
  return yield* S.decodeEffect(Amount)(decimal)
})

/** An asset's atomic denomination: how many decimal places one nominal unit subdivides into. */
export interface AtomicUnit {
  /** Decimal places per nominal unit — a non-negative integer, e.g. 6 for USDC, 18 for ETH. */
  readonly decimals: number
  /** Defaults to `"ceil"` so converting a nominal amount to atomic units never under-collects. */
  readonly rounding?: BigDecimal.RoundingMode | undefined
}

const decodeDecimals = S.decodeEffect(S.Finite.check(S.isInt(), S.isGreaterThanOrEqualTo(0)))

/**
 * Converts a nominal {@link Amount} to {@link Atomic} units, rounding (per `unit.rounding`)
 * when the amount is more precise than the unit allows.
 */
export const toAtomic = Effect.fnUntraced(function* (amount: Amount, unit: AtomicUnit) {
  const decimals = yield* decodeDecimals(unit.decimals)
  const rounded = BigDecimal.normalize(
    BigDecimal.round(amount, {
      scale: decimals,
      mode: unit.rounding ?? "ceil",
    }),
  )
  const digits = (rounded.value * 10n ** BigInt(decimals - rounded.scale)).toString()
  return Atomic.make(digits, { disableChecks: true })
})

/** Converts {@link Atomic} units back to a nominal {@link Amount}, losslessly. */
export const fromAtomic = Effect.fnUntraced(function* (atomic: Atomic, unit: AtomicUnit) {
  const decimals = yield* decodeDecimals(unit.decimals)
  return Amount.make(BigDecimal.make(BigInt(atomic), decimals), { disableChecks: true })
})

/** Schema codec between {@link Atomic} strings and nominal {@link Amount}s for the given unit. */
export const atomic = (unit: AtomicUnit) =>
  Atomic.pipe(
    S.decodeTo(Amount, {
      decode: SchemaGetter.transformOrFail((value) =>
        fromAtomic(value, unit).pipe(Effect.mapError((error) => error.issue)),
      ),
      encode: SchemaGetter.transformOrFail((value) =>
        toAtomic(Amount.make(value, { disableChecks: true }), unit).pipe(Effect.mapError((error) => error.issue)),
      ),
    }),
  )

/** Renders an {@link Amount} as a minimal decimal string, with trailing fractional zeros removed. */
export const format = (amount: Amount): string => BigDecimal.format(BigDecimal.normalize(amount))

/** Schema codec between decimal strings and {@link Amount}s. */
export const AmountFromString = S.String.pipe(
  S.decodeTo(Amount, {
    decode: SchemaGetter.transformOrFail((value) => from(value).pipe(Effect.mapError((error) => error.issue))),
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
  const units = rounded.value * 10n ** BigInt(decimals - rounded.scale)
  const scale = 10n ** BigInt(decimals)
  const fraction = decimals === 0 ? "" : `.${(units % scale).toString().padStart(decimals, "0")}`
  return `${units / scale}${fraction}`
})
