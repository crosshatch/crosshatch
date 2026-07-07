import { Context } from "effect"

import type { Adapter } from "./Adapter.ts"
import type { Asset } from "./Asset.ts"

export interface PhysicalAsset {
  readonly symbol: string
  readonly peg: string
  readonly deployments: Record<string, Record<string, Deployment>>
}

export interface Deployment {
  readonly asset: typeof Asset.Type
  readonly decimals: number
  readonly name: string
  readonly version: string
  readonly adapter: Context.ServiceClass<any, any, Adapter>
}
