import { BigDecimal, Data, Effect, Option, Schema as S, SchemaGetter } from "effect"

export type Atomic = typeof Atomic.Type
export const Atomic = S.String.check(S.isPattern(/^(?:0|[1-9]\d*)$/u)).pipe(S.brand("crosshatch/Atomic"))

export type Amount = typeof Amount.Type
export const Amount = S.BigDecimal.check(S.isGreaterThanOrEqualToBigDecimal(BigDecimal.fromBigInt(0n))).pipe(
  S.brand("crosshatch/Amount"),
)

export type Input = number | bigint | string | BigDecimal.BigDecimal

export class InvalidAmountError extends Data.TaggedError("InvalidAmountError")<{
  readonly input: Input
}> {}

export const from = Effect.fnUntraced(function* (input: Input) {
  const v =
    typeof input === "number"
      ? Number.isFinite(input)
        ? Option.getOrUndefined(BigDecimal.fromNumber(input))
        : undefined
      : typeof input === "bigint"
        ? BigDecimal.fromBigInt(input)
        : typeof input === "string"
          ? input.trim() === ""
            ? undefined
            : Option.getOrUndefined(BigDecimal.fromString(input.trim()))
          : input
  if (v === undefined || BigDecimal.isNegative(v)) {
    return yield* new InvalidAmountError({ input })
  }
  return Amount.make(v, { disableChecks: true })
})

export const parse = (input: string): Effect.Effect<Amount, InvalidAmountError> => {
  const trimmed = input.trim()
  return trimmed === ""
    ? new InvalidAmountError({ input })
    : BigDecimal.fromString(trimmed).pipe(
        Option.match({
          onNone: () => new InvalidAmountError({ input }),
          onSome: (decimal) =>
            BigDecimal.isNegative(decimal)
              ? new InvalidAmountError({ input })
              : Effect.succeed(Amount.make(decimal, { disableChecks: true })),
        }),
      )
}

export interface AtomicUnit {
  readonly decimals: number
  readonly rounding?: BigDecimal.RoundingMode | undefined
}

export const toAtomic = (amount: Amount, unit: AtomicUnit): Atomic => {
  const rounded = BigDecimal.normalize(
    BigDecimal.round(amount, {
      scale: unit.decimals,
      mode: unit.rounding ?? "ceil",
    }),
  )
  return Atomic.make((rounded.value * 10n ** BigInt(unit.decimals - rounded.scale)).toString(), { disableChecks: true })
}

export const fromAtomic = (atomic: Atomic, unit: AtomicUnit): Amount =>
  Amount.make(BigDecimal.make(BigInt(atomic), unit.decimals), { disableChecks: true })

export const atomic = (unit: AtomicUnit) =>
  Atomic.pipe(
    S.decodeTo(Amount, {
      decode: SchemaGetter.transform((value) => fromAtomic(value, unit)),
      encode: SchemaGetter.transform((value) => toAtomic(Amount.make(value, { disableChecks: true }), unit)),
    }),
  )

export const format = (amount: Amount): string => BigDecimal.format(BigDecimal.normalize(amount))

export const display = (amount: Amount, decimals: number): string => {
  const rounded = BigDecimal.normalize(BigDecimal.round(amount, { scale: decimals, mode: "floor" }))
  const units = rounded.value * 10n ** BigInt(decimals - rounded.scale)
  const scale = 10n ** BigInt(decimals)
  const fraction = decimals === 0 ? "" : `.${(units % scale).toString().padStart(decimals, "0")}`
  return `${units / scale}${fraction}`
}
