import type { PayloadAdapter } from "./Adapter.ts"
import { Asset } from "./Asset.ts"

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
  readonly adapters: ReadonlyArray<PayloadAdapter<any, any>>
}
