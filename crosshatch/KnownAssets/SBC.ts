import { type PhysicalAsset } from "../Asset.ts"
import { EvmAsset, Erc3009, Permit2 } from "../Evm/Evm.ts"

export const SBC = {
  peg: "USD",
  symbol: "SBC",
  deployments: {
    eip155: {
      723487: {
        asset: EvmAsset.EvmAsset.make("0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb"),
        decimals: 6,
        name: "Stable Coin",
        version: "1",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
