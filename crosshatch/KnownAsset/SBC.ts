import { EvmChain, EvmAsset } from "../Evm/Evm.ts"
import type { PhysicalAsset } from "../PhysicalAsset.ts"

export const SBC = {
  eip155: {
    723487: {
      asset: EvmAsset.EvmAsset.make("0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb"),
      decimals: 6,
      name: "Stable Coin",
      version: "1",
      service: EvmChain.EvmChain,
    },
    72344: {
      asset: EvmAsset.EvmAsset.make("0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb"),
      decimals: 6,
      name: "Stable Coin",
      version: "1",
      service: EvmChain.EvmChain,
    },
  },
} as const satisfies PhysicalAsset
