import { EvmChain, EvmAsset } from "../Evm/Evm.ts"
import { type PhysicalAsset, usdDenomination } from "../PhysicalAsset.ts"

export const MUSD = {
  denomination: usdDenomination("MUSD"),
  deployments: {
    eip155: {
      31612: {
        asset: EvmAsset.EvmAsset.make("0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186"),
        decimals: 18,
        name: "Mezo USD",
        version: "1",
        service: EvmChain.EvmChain,
      },
      31611: {
        asset: EvmAsset.EvmAsset.make("0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503"),
        decimals: 18,
        name: "Mezo USD",
        version: "1",
        service: EvmChain.EvmChain,
      },
    },
  },
} as const satisfies PhysicalAsset
