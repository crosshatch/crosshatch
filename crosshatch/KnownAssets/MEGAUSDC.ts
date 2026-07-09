import { type PhysicalAsset } from "../Asset.ts"
import { EvmAsset, Permit2, Erc3009 } from "../Evm/Evm.ts"

export const MEGAUSDC = {
  peg: "USD",
  symbol: "MEGAUSDC",
  deployments: {
    eip155: {
      4326: {
        asset: EvmAsset.EvmAsset.make("0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7"),
        decimals: 18,
        name: "MegaUSD",
        version: "1",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
