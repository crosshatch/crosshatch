import { Effect, Data } from "effect"

import * as Amount from "./Amount.ts"
import { findByChain } from "./Asset.ts"
import { ASSETS } from "./ASSETS.ts"

export type KnownAsset = (typeof ASSETS)[keyof typeof ASSETS]

export type NetworkName = KnownAsset["chainId"]

export type AssetName = KnownAsset["symbol"]

export type PaymentSpec = `${number} ${NetworkName} ${AssetName}`

export class InvalidPaymentSpecError extends Data.TaggedError("InvalidPaymentSpecError")<{
  readonly spec: string
}> {}

export const unwrap = Effect.fnUntraced(function* (spec: PaymentSpec) {
  const [amountInput, networkName, assetName, ...rest] = spec.trim().split(/\s+/)
  if (!amountInput || !networkName || !assetName || rest.length > 0) {
    return yield* new InvalidPaymentSpecError({ spec })
  }
  const asset = findByChain(networkName, ASSETS).find((asset) => asset.symbol === assetName)
  if (!asset) {
    return yield* new InvalidPaymentSpecError({ spec })
  }
  const amount = yield* Amount.parseUsd(amountInput)
  return { amount, asset }
})
