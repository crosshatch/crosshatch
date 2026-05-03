import type { ChainIdString, AccountAddress } from "@crosshatch/caip"
import { Schema as S, Effect, BigDecimal, Option, Data } from "effect"

const MICROS_PER_USD = 1_000_000n
const MICROS_PER_USD_DECIMAL = BigDecimal.make(MICROS_PER_USD, 0)

export interface SupportedAsset {
  readonly network: typeof ChainIdString.Type
  readonly asset: typeof AccountAddress.Type
  readonly decimals: number
  readonly rpcs: ReadonlyArray<string>
}

export const Micros = S.BigInt.check(S.isGreaterThanOrEqualToBigInt(0n)).pipe(S.brand("Micros"))

export const format = (amount: typeof Micros.Type): string => {
  const dollars = amount / MICROS_PER_USD
  const micros = amount % MICROS_PER_USD
  if (micros === 0n) return dollars.toString()
  return `${dollars}.${micros.toString().padStart(6, "0").replace(/0+$/, "")}`
}

const ceilDiv = (numerator: bigint, denominator: bigint) =>
  numerator === 0n ? 0n : (numerator - 1n) / denominator + 1n

const integerDecimalToBigInt = (decimal: BigDecimal.BigDecimal) =>
  decimal.scale < 0 ? decimal.value * 10n ** BigInt(-decimal.scale) : decimal.value

export const fromX402 = (amount: string, asset: SupportedAsset): typeof Micros.Type =>
  Micros.make(ceilDiv(BigInt(amount) * MICROS_PER_USD, 10n ** BigInt(asset.decimals)))

export class MicrosInvalidError extends Data.TaggedError("MicrosInvalidError")<{ input: string }> {}

export const parseInput = (input: string) =>
  input.trim() === ""
    ? new MicrosInvalidError({ input }).asEffect()
    : BigDecimal.fromString(input).pipe(
        Option.match({
          onNone: () => new MicrosInvalidError({ input }).asEffect(),
          onSome: (decimal) => {
            if (BigDecimal.isNegative(decimal)) return new MicrosInvalidError({ input }).asEffect()
            const micros = BigDecimal.multiply(decimal, MICROS_PER_USD_DECIMAL)
            if (!BigDecimal.isInteger(micros)) return new MicrosInvalidError({ input }).asEffect()
            return Effect.succeed(Micros.make(integerDecimalToBigInt(BigDecimal.normalize(micros))))
          },
        }),
      )
