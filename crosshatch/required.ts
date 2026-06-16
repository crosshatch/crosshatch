import { Amount, Asset } from "@crosshatch/assets"
import type { AccountAddress } from "@crosshatch/caip"
import { Required, Requirements } from "@crosshatch/x402"

export const required = ({
  url,
  amount,
  asset,
  description,
  recipient,
}: {
  readonly url: string
  readonly amount: typeof Amount.Usd.Type
  readonly asset: Asset.Asset
  readonly description: string
  readonly recipient: typeof AccountAddress.Type
}) =>
  Required.Required.make({
    x402Version: 2,
    accepts: [
      Requirements.Requirements.make({
        amount: Amount.usdToAtomic(amount, asset),
        asset: asset.address,
        extra: Asset.toX402Extra(asset),
        maxTimeoutSeconds: 60,
        network: asset.chainId as never,
        payTo: recipient,
        scheme: "exact",
      }),
    ],
    resource: { url, description },
  })
