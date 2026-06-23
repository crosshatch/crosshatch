import { AccountAddress } from "crosshatch/Ca"

import type { Asset } from "../Asset.ts"

export const USDCE = {
  eip155: {
    36900: {
      address: AccountAddress.make("0x9cb8142aEBBcdc60AF7c97Af897A67A8f3CA71C2"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USDC.e",
      symbol: "USDC.e",
      version: "2",
    },
    190415: {
      address: AccountAddress.make("0x401eCb1D350407f13ba348573E5630B83638E30D"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "Bridged USDC",
      symbol: "USDC.e",
      version: "2",
    },
    181228: {
      address: AccountAddress.make("0x401eCb1D350407f13ba348573E5630B83638E30D"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "Bridged USDC",
      symbol: "USDC.e",
      version: "2",
    },
  },
} as const satisfies Asset
