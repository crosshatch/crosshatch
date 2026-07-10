import { type PhysicalAsset } from "../Asset.ts"
import { Eip155Asset, Erc3009, Permit2 } from "../Eip155/Eip155.ts"

export const USDT0 = {
  peg: "USD",
  symbol: "USDT0",
  deployments: {
    eip155: {
      988: {
        asset: Eip155Asset.Eip155Asset.make("0x779Ded0c9e1022225f8E0630b35a9b54bE713736"),
        decimals: 6,
        name: "USDT0",
        version: "1",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
