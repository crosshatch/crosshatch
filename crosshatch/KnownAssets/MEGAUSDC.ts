import { EvmChain, EvmAsset } from "../Evm/Evm.ts"
import { type PhysicalAsset } from "../PhysicalAsset.ts"

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
        service: EvmChain.EvmChain,
      },
    },
  },
} as const satisfies PhysicalAsset
