import { AccountAddress } from "@crosshatch/caip"
import { Asset } from "crosshatch"

export const USDT0 = {
  eip155: {
    988: {
      address: AccountAddress.make("0x779Ded0c9e1022225f8E0630b35a9b54bE713736"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USDT0",
      symbol: "USDT0",
      version: "1",
    },
    2201: {
      address: AccountAddress.make("0x78Cf24370174180738C5B8E352B6D14c83a6c9A9"),
      assetNamespace: "erc20",
      decimals: 6,
      name: "USDT0",
      symbol: "USDT0",
      version: "1",
    },
  },
} as const satisfies Asset.Asset
