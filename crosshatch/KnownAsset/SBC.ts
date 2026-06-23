import { AccountAddress } from "crosshatch/Ca"

import type { Asset } from "../Asset.ts"

export const SBC = {
  eip155: {
    723487: {
      address: AccountAddress.make("0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "Stable Coin",
      symbol: "SBC",
      version: "1",
    },
    72344: {
      address: AccountAddress.make("0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "Stable Coin",
      symbol: "SBC",
      version: "1",
    },
  },
} as const satisfies Asset
