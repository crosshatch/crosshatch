import { BigDecimal, Data, Effect, Option, Schema as S, SchemaGetter } from "effect"

export const Atomic = S.String.check(S.isPattern(/^(?:0|[1-9]\d*)$/u)).pipe(S.brand("crosshatch/Atomic"))

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
  return Amount.make(v)
})

export const parse = (input: string): Effect.Effect<typeof Amount.Type, InvalidAmountError> => {
  const trimmed = input.trim()
  return trimmed === ""
    ? new InvalidAmountError({ input })
    : BigDecimal.fromString(trimmed).pipe(
        Option.match({
          onNone: () => new InvalidAmountError({ input }),
          onSome: (decimal) =>
            BigDecimal.isNegative(decimal) ? new InvalidAmountError({ input }) : Effect.succeed(Amount.make(decimal)),
        }),
      )
}

export interface AtomicUnit {
  readonly decimals: number
  readonly rounding?: BigDecimal.RoundingMode | undefined
}

export const toAtomic = (amount: typeof Amount.Type, unit: AtomicUnit): typeof Atomic.Type => {
  const rounded = BigDecimal.normalize(
    BigDecimal.round(amount, {
      scale: unit.decimals,
      mode: unit.rounding ?? "ceil",
    }),
  )
  return Atomic.make((rounded.value * 10n ** BigInt(unit.decimals - rounded.scale)).toString())
}

export const fromAtomic = (atomic: typeof Atomic.Type, unit: AtomicUnit): typeof Amount.Type =>
  Amount.make(BigDecimal.make(BigInt(atomic), unit.decimals))

export const atomic = (unit: AtomicUnit) =>
  Atomic.pipe(
    S.decodeTo(Amount, {
      decode: SchemaGetter.transform((value) => fromAtomic(value, unit)),
      encode: SchemaGetter.transform((value) => toAtomic(Amount.make(value), unit)),
    }),
  )

export const format = (amount: typeof Amount.Type): string => BigDecimal.format(BigDecimal.normalize(amount))

export const display = (amount: typeof Amount.Type, decimals: number): string => {
  const rounded = BigDecimal.normalize(BigDecimal.round(amount, { scale: decimals, mode: "floor" }))
  const units = rounded.value * 10n ** BigInt(decimals - rounded.scale)
  const scale = 10n ** BigInt(decimals)
  const fraction = decimals === 0 ? "" : `.${(units % scale).toString().padStart(decimals, "0")}`
  return `${units / scale}${fraction}`
}
