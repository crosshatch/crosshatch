import { AccountAddress, ChainIdString } from "@crosshatch/caip"
import { Requirements } from "@crosshatch/x402"

import * as Amount from "./Amount.ts"

export interface Asset {
  readonly address: typeof AccountAddress.Encoded
  readonly assetTransferMethod?: "permit2" | undefined
  readonly chainId: typeof ChainIdString.Encoded
  readonly decimals: number
  readonly name: string
  readonly namespace: "erc20"
  readonly supportsEip2612?: boolean | undefined
  readonly symbol: string
  readonly version: string
}

export const toX402Extra = (asset: Asset): Record<string, unknown> => ({
  name: asset.name,
  version: asset.version,
  ...(asset.assetTransferMethod ? { assetTransferMethod: asset.assetTransferMethod } : {}),
  ...(asset.supportsEip2612 === undefined ? {} : { supportsEip2612: asset.supportsEip2612 }),
})

export const findByX402 = (chainId: string, x402Asset: string, assets: Record<string, Asset>): Asset | undefined =>
  Object.values(assets).find(
    (asset) => asset.chainId === chainId && asset.address.toLowerCase() === x402Asset.toLowerCase(),
  )

export const findByChain = (chainId: string, assets: Record<string, Asset>): ReadonlyArray<Asset> =>
  Object.values(assets).filter((asset) => asset.chainId === chainId)

export const requirements = ({
  asset,
  recipient,
  amount,
}: {
  readonly asset: Asset
  readonly recipient: string
  readonly amount: typeof Amount.Usd.Type
}) => {
  const { address, name, version, chainId } = asset
  return Requirements.Requirements.make({
    amount: Amount.usdToAtomic(amount, asset),
    asset: address,
    extra: { name, version },
    maxTimeoutSeconds: 300,
    network: ChainIdString.make(chainId),
    payTo: AccountAddress.make(recipient),
    scheme: "exact",
  })
}
