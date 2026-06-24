import { BigDecimal, Effect, Option, Schema as S, Data } from "effect"

import type { Deployment } from "./PhysicalAsset.ts"

export const Atomic = S.String.check(S.isPattern(/^(0|[1-9]\d*)$/)).pipe(S.brand("Atomic"))

export const Usd = S.BigInt.check(S.isGreaterThanOrEqualToBigInt(0n)).pipe(S.brand("Usd"))

const MICROS_PER_USD = 1_000_000n
const MICROS_PER_USD_DECIMAL = BigDecimal.make(MICROS_PER_USD, 0)

const ceilDiv = (numerator: bigint, denominator: bigint) =>
  numerator === 0n ? 0n : (numerator - 1n) / denominator + 1n

const integerDecimalToBigInt = (decimal: BigDecimal.BigDecimal) =>
  decimal.scale < 0 ? decimal.value * 10n ** BigInt(-decimal.scale) : decimal.value

const atomicScale = ({ decimals }: Deployment) => 10n ** BigInt(decimals)

export class InvalidUsdError extends Data.TaggedError("InvalidUsdError")<{
  readonly input: string
}> {}

export const parseUsd = (input: string): Effect.Effect<typeof Usd.Type, InvalidUsdError> =>
  input.trim() === ""
    ? new InvalidUsdError({ input })
    : BigDecimal.fromString(input.trim().replace(/^\$/, "")).pipe(
        Option.match({
          onNone: () => new InvalidUsdError({ input }),
          onSome: (decimal) => {
            if (BigDecimal.isNegative(decimal)) return new InvalidUsdError({ input })
            const micros = BigDecimal.multiply(decimal, MICROS_PER_USD_DECIMAL)
            if (!BigDecimal.isInteger(micros)) return new InvalidUsdError({ input })
            return Effect.succeed(Usd.make(integerDecimalToBigInt(BigDecimal.normalize(micros))))
          },
        }),
      )

export const formatUsd = (amount: typeof Usd.Type): string => {
  const dollars = amount / MICROS_PER_USD
  const micros = amount % MICROS_PER_USD
  if (micros === 0n) return dollars.toString()
  return `${dollars}.${micros.toString().padStart(6, "0").replace(/0+$/, "")}`
}

export const displayUsd = (amount: typeof Usd.Type): string => {
  const dollars = amount / MICROS_PER_USD
  const micros = amount % MICROS_PER_USD
  return `$${dollars}.${(micros / 100n).toString().padStart(4, "0")}`
}

export const usdToAtomic = (amount: typeof Usd.Type, assetDeployment: Deployment): typeof Atomic.Type =>
  Atomic.make(ceilDiv(amount * atomicScale(assetDeployment), MICROS_PER_USD).toString())

export const atomicToUsd = (amount: typeof Atomic.Type, assetDeployment: Deployment): typeof Usd.Type =>
  Usd.make(ceilDiv(BigInt(amount) * MICROS_PER_USD, atomicScale(assetDeployment)))

export const usdFromNumber = (amount: number): typeof Usd.Type => {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new InvalidUsdError({ input: String(amount) })
  }

  const micros = amount * Number(MICROS_PER_USD)
  if (!Number.isSafeInteger(micros)) {
    throw new InvalidUsdError({ input: String(amount) })
  }
  return Usd.make(BigInt(micros))
}
