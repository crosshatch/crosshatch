import { Record, Context } from "effect"

import type { Asset } from "./Asset.ts"
import type { Chain } from "./Chain.ts"

export type PhysicalAssetLookup = Record<string, PhysicalAsset>

export type PhysicalAsset = Record<string, Record<string, Deployment>>

export interface Deployment {
  readonly asset: typeof Asset.Type
  readonly decimals: number
  readonly name: string
  readonly version: string
  readonly service: Context.ServiceClass<any, any, Chain>
}
