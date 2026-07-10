import { type PhysicalAsset } from "../Asset.ts"
import { Eip155Asset, Erc3009, Permit2 } from "../Eip155/Eip155.ts"

export const USDCE = {
  peg: "USD",
  symbol: "USDC.e",
  deployments: {
    eip155: {
      36900: {
        asset: Eip155Asset.Eip155Asset.make("0x9cb8142aEBBcdc60AF7c97Af897A67A8f3CA71C2"),
        decimals: 6,
        name: "USDC.e",
        version: "2",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
      190415: {
        asset: Eip155Asset.Eip155Asset.make("0x401eCb1D350407f13ba348573E5630B83638E30D"),
        decimals: 6,
        name: "Bridged USDC",
        version: "2",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
