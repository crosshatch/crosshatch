import type { AccountAddress } from "@crosshatch/caip"
import { Required, Requirements } from "@crosshatch/x402"

import { toX402, type Micros, type SupportedAsset } from "./Micros.ts"

export const makeRequired = ({
  url,
  amount,
  asset,
  description,
  recipient,
}: {
  readonly url: string
  readonly amount: typeof Micros.Type
  readonly asset: SupportedAsset
  readonly description: string
  readonly recipient: typeof AccountAddress.Type
}) =>
  Required.Required.make({
    x402Version: 2,
    accepts: [
      Requirements.Requirements.make({
        amount: toX402(amount, asset),
        asset: asset.asset,
        extra: {
          name: "USD Coin",
          version: "2",
        },
        maxTimeoutSeconds: 60,
        network: asset.network,
        payTo: recipient,
        scheme: "exact",
      }),
    ],
    resource: { url, description },
  })
