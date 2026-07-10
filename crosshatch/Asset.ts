import { Schema as S } from "effect"

import type { Adapter } from "./Adapter.ts"

export const brand = S.brand("crosshatch/Asset")

export const Asset = S.String.pipe(S.brand("crosshatch/Asset"))

export type AssetConfig = Readonly<Record<string, PhysicalAsset>>

export interface PhysicalAsset {
  readonly symbol: string
  readonly peg: string
  readonly deployments: Record<string, Record<string, PhysicalAssetDeployment>>
}

export interface PhysicalAssetDeployment {
  readonly asset: typeof Asset.Type
  readonly decimals: number
  readonly name: string
  readonly version: string
  readonly adapters: ReadonlyArray<Adapter<any, any>>
}
