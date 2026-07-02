import type { Context } from "effect"

import type { Asset } from "./Asset.ts"
import type { Chain } from "./Chain.ts"

export type PhysicalAssetLookup = Record<string, PhysicalAsset>

export interface PhysicalAsset {
  readonly denomination: Denomination
  readonly deployments: Record<string, Record<string, Deployment>>
}

export interface Denomination {
  readonly symbol: string
  readonly peg: "USD"
  readonly displayDecimals: number
}

export const usdDenomination = <const Symbol extends string>(symbol: Symbol) =>
  ({
    symbol,
    peg: "USD",
    displayDecimals: 2,
  }) as const satisfies Denomination

export interface Deployment {
  readonly asset: typeof Asset.Type
  readonly decimals: number
  readonly name: string
  readonly version: string
  readonly service: Context.ServiceClass<any, any, Chain>
}
