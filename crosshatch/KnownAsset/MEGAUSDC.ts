import { AccountAddress } from "crosshatch/Ca"

import type { Asset } from "../Asset.ts"

export const MEGAUSDC = {
  eip155: {
    4326: {
      address: AccountAddress.make("0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7"),
      assetNamespace: "erc20",
      decimals: 18,
      name: "MegaUSD",
      symbol: "MegaUSD",
      version: "1",
    },
  },
} as const satisfies Asset
