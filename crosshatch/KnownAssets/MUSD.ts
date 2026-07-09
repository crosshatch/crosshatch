import { type PhysicalAsset } from "../Asset.ts"
import { EvmAsset, Erc3009, Permit2 } from "../Evm/Evm.ts"

export const MUSD = {
  peg: "USD",
  symbol: "MUSD",
  deployments: {
    eip155: {
      31612: {
        asset: EvmAsset.EvmAsset.make("0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186"),
        decimals: 18,
        name: "Mezo USD",
        version: "1",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
