import { ChainId, CaChain, Asset } from "crosshatch/Ca"
import { Requirements } from "crosshatch/X402"
import { Record, Effect, Context } from "effect"

import { NoSuchSupportedAssetError } from "./errors.ts"

export type PhysicalAsset = Record<string, Record<string, Deployment>>

export interface Deployment {
  readonly asset: typeof Asset.Asset.Type
  readonly assetNamespace: "erc20"
  readonly decimals: number
  readonly name: string
  readonly symbol: string
  readonly version: string
  readonly service: Context.ServiceClass<any, any, CaChain.CaChain>
}

export const getFirstSupported = Effect.fnUntraced(function* (
  supported: Record<string, PhysicalAsset>,
  accepts: ReadonlyArray<typeof Requirements.Requirements.Type>,
) {
  for (const asset of Object.values(supported)) {
    for (const [namespace, references] of Object.entries(asset)) {
      for (const [reference, deployment] of Object.entries(references)) {
        const network = ChainId.ChainId.make(`${namespace}:${reference}`)
        for (const accepted of accepts) {
          if (network === accepted.network && deployment.asset === accepted.asset) {
            return { accepted, deployment, network }
          }
        }
      }
    }
  }
  return yield* new NoSuchSupportedAssetError({
    notFound: accepts.map(({ network: chainId, asset }) => ({ chainId, asset })),
  })
})
