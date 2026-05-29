import { ChainIdString } from "@crosshatch/caip"
import { Schema as S, Effect, BigDecimal, Option, Data } from "effect"

import { type Asset, SUPPORTED } from "./Asset.ts"

export const Micros = S.BigInt.check(S.isGreaterThanOrEqualToBigInt(0n)).pipe(S.brand("Micros"))

const MICROS_PER_USD = 1_000_000n
const MICROS_PER_USD_DECIMAL = BigDecimal.make(MICROS_PER_USD, 0)

export const findSupported = (network: typeof ChainIdString.Type, asset: string) =>
  SUPPORTED.find((supported) => supported.network === network && supported.asset.toLowerCase() === asset.toLowerCase())

export const format = (amount: typeof Micros.Type): string => {
  const dollars = amount / MICROS_PER_USD
  const micros = amount % MICROS_PER_USD
  if (micros === 0n) return dollars.toString()
  return `${dollars}.${micros.toString().padStart(6, "0").replace(/0+$/, "")}`
}

export const display = (amount: typeof Micros.Type): string => {
  const dollars = amount / MICROS_PER_USD
  const micros = amount % MICROS_PER_USD
  return `$${dollars}.${(micros / 100n).toString().padStart(4, "0")}`
}

const ceilDiv = (numerator: bigint, denominator: bigint) =>
  numerator === 0n ? 0n : (numerator - 1n) / denominator + 1n

const integerDecimalToBigInt = (decimal: BigDecimal.BigDecimal) =>
  decimal.scale < 0 ? decimal.value * 10n ** BigInt(-decimal.scale) : decimal.value

export const fromX402 = (amount: string, asset: Asset): typeof Micros.Type =>
  Micros.make(ceilDiv(BigInt(amount) * MICROS_PER_USD, 10n ** BigInt(asset.decimals)))

export const fromInt = (n: number) => Micros.make(BigInt(n * 1000))

export const fromString = (n: string) => fromInt(parseInt(n))

export const toX402 = (amount: typeof Micros.Type, asset: Asset): string =>
  ceilDiv(amount * 10n ** BigInt(asset.decimals), MICROS_PER_USD).toString()

export class MicrosInvalidError extends Data.TaggedError("MicrosInvalidError")<{ input: string }> {}

export const parseInput = (input: string) =>
  input.trim() === ""
    ? new MicrosInvalidError({ input })
    : BigDecimal.fromString(input).pipe(
        Option.match({
          onNone: () => new MicrosInvalidError({ input }),
          onSome: (decimal) => {
            if (BigDecimal.isNegative(decimal)) return new MicrosInvalidError({ input })
            const micros = BigDecimal.multiply(decimal, MICROS_PER_USD_DECIMAL)
            if (!BigDecimal.isInteger(micros)) return new MicrosInvalidError({ input })
            return Effect.succeed(Micros.make(integerDecimalToBigInt(BigDecimal.normalize(micros))))
          },
        }),
      )
