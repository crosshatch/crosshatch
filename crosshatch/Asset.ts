import { Schema as S } from "effect"

import type { Scheme } from "./Scheme.ts"

export const brand = S.brand("crosshatch/Asset")

export const Asset = S.String.pipe(S.brand("crosshatch/Asset"))

export interface PhysicalAsset {
  readonly asset: typeof Asset.Type
  readonly decimals: number
  readonly name: string
  readonly version: string
  readonly schemes: ReadonlyArray<Scheme.Any>
  readonly metadata?: unknown
}

type ReferenceId = string
type NamespaceId = string
type AssetId = string

export type References = Readonly<Record<ReferenceId, PhysicalAsset>>
export type LogicalAsset = Readonly<Record<NamespaceId, References>>
export type Denomination = Readonly<Record<AssetId, LogicalAsset>>
