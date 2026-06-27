import { Chain, Asset } from "crosshatch"
import { Record, Context } from "effect"

export type PhysicalAssetLookup = Record<string, PhysicalAsset>

export type PhysicalAsset = Record<string, Record<string, Deployment>>

export interface Deployment {
  readonly asset: typeof Asset.Asset.Type
  readonly assetNamespace: "erc20"
  readonly decimals: number
  readonly name: string
  readonly symbol: string
  readonly version: string
  readonly service: Context.ServiceClass<any, any, Chain.Chain>
}
