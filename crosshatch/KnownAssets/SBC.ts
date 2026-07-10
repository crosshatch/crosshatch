import { type PhysicalAsset } from "../Asset.ts"
import { Eip155Asset, Erc3009, Permit2 } from "../Eip155/Eip155.ts"

export const SBC = {
  peg: "USD",
  symbol: "SBC",
  deployments: {
    eip155: {
      723487: {
        asset: Eip155Asset.Eip155Asset.make("0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb"),
        decimals: 6,
        name: "Stable Coin",
        version: "1",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
