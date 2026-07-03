import { EvmChain, EvmAsset } from "../Evm/Evm.ts"
import { type PhysicalAsset } from "../PhysicalAsset.ts"

export const USDCE = {
  peg: "USD",
  symbol: "USDC.e",
  deployments: {
    eip155: {
      36900: {
        asset: EvmAsset.EvmAsset.make("0x9cb8142aEBBcdc60AF7c97Af897A67A8f3CA71C2"),
        decimals: 6,
        name: "USDC.e",
        version: "2",
        service: EvmChain.EvmChain,
      },
      190415: {
        asset: EvmAsset.EvmAsset.make("0x401eCb1D350407f13ba348573E5630B83638E30D"),
        decimals: 6,
        name: "Bridged USDC",
        version: "2",
        service: EvmChain.EvmChain,
      },
      181228: {
        asset: EvmAsset.EvmAsset.make("0x401eCb1D350407f13ba348573E5630B83638E30D"),
        decimals: 6,
        name: "Bridged USDC",
        version: "2",
        service: EvmChain.EvmChain,
      },
    },
  },
} as const satisfies PhysicalAsset
