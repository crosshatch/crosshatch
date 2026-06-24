import { EvmChain, EvmAsset } from "../Evm/Evm.ts"
import type { PhysicalAsset } from "../PhysicalAsset.ts"

export const MEGAUSDC = {
  eip155: {
    4326: {
      asset: EvmAsset.EvmAsset.make("0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7"),
      assetNamespace: "erc20",
      decimals: 18,
      name: "MegaUSD",
      symbol: "MegaUSD",
      version: "1",
      service: EvmChain.EvmChain,
    },
  },
} as const satisfies PhysicalAsset
