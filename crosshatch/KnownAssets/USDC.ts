import { type PhysicalAsset } from "../Asset.ts"
import { Eip155Asset, Erc3009, Permit2 } from "../Eip155/Eip155.ts"

export const USDC = {
  peg: "USD",
  symbol: "USDC",
  deployments: {
    eip155: {
      50: {
        asset: Eip155Asset.Eip155Asset.make("0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1"),
        decimals: 6,
        name: "USDC",
        version: "2",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
      137: {
        asset: Eip155Asset.Eip155Asset.make("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"),
        decimals: 6,
        name: "USD Coin",
        version: "2",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
      143: {
        asset: Eip155Asset.Eip155Asset.make("0x754704Bc059F8C67012fEd69BC8A327a5aafb603"),
        decimals: 6,
        name: "USD Coin",
        version: "2",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
      8453: {
        asset: Eip155Asset.Eip155Asset.make("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
        decimals: 6,
        name: "USD Coin",
        version: "2",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
      42161: {
        asset: Eip155Asset.Eip155Asset.make("0xaf88d065e77c8cC2239327C5EDb3A432268e5831"),
        decimals: 6,
        name: "USD Coin",
        version: "2",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
