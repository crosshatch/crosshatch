import { EvmAsset } from "../Evm/Evm.ts"
import { Erc3009Adapter } from "../payload_adapters/Erc3009.ts"
import { Permit2Adapter } from "../payload_adapters/Permit2.ts"
import { type PhysicalAsset } from "../PhysicalAsset.ts"

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
        adapters: [Erc3009Adapter, Permit2Adapter],
      },
      72344: {
        asset: EvmAsset.EvmAsset.make("0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb"),
        decimals: 6,
        name: "Stable Coin",
        version: "1",
        adapters: [Erc3009Adapter, Permit2Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
