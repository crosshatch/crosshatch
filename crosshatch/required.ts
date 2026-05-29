import type { AccountAddress } from "@crosshatch/caip"
import { Required, Requirements } from "@crosshatch/x402"

import type { Asset } from "./Asset.ts"
import { toX402, type Micros } from "./Micros.ts"

export const required = ({
  url,
  amount,
  asset,
  description,
  recipient,
}: {
  readonly url: string
  readonly amount: typeof Micros.Type
  readonly asset: Asset
  readonly description: string
  readonly recipient: typeof AccountAddress.Type
}) =>
  Required.Required.make({
    x402Version: 2,
    accepts: [
      Requirements.Requirements.make({
        amount: toX402(amount, asset),
        asset: asset.asset,
        extra: asset.extra,
        maxTimeoutSeconds: 60,
        network: asset.network,
        payTo: recipient,
        scheme: "exact",
      }),
    ],
    resource: { url, description },
  })
