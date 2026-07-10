import { type PhysicalAsset } from "../Asset.ts"
import { Eip155Asset, Erc3009, Permit2 } from "../Eip155/Eip155.ts"

export const MEGAUSDC = {
  peg: "USD",
  symbol: "MEGAUSDC",
  deployments: {
    eip155: {
      4326: {
        asset: Eip155Asset.Eip155Asset.make("0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7"),
        decimals: 18,
        name: "MegaUSD",
        version: "1",
        adapters: [Erc3009.Erc3009Adapter, Permit2.Permit2Adapter],
      },
    },
  },
} as const satisfies PhysicalAsset
