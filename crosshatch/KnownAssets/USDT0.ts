import { EvmAsset } from "../Evm/Evm.ts"
import { Eip3009Adapter } from "../payload_adapters/Erc3009.ts"
import { type PhysicalAsset } from "../PhysicalAsset.ts"

export const USDT0 = {
  peg: "USD",
  symbol: "USDT0",
  deployments: {
    eip155: {
      988: {
        asset: EvmAsset.EvmAsset.make("0x779Ded0c9e1022225f8E0630b35a9b54bE713736"),
        decimals: 6,
        name: "USDT0",
        version: "1",
        adapters: [Eip3009Adapter],
      },
      2201: {
        asset: EvmAsset.EvmAsset.make("0x78Cf24370174180738C5B8E352B6D14c83a6c9A9"),
        decimals: 6,
        name: "USDT0",
        version: "1",
        adapters: [Eip3009Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
