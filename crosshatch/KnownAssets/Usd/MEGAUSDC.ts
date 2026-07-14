import type { References } from "../../Asset.ts"
import { Eip155Asset, Erc3009Scheme, Permit2Scheme } from "../../Eip155/Eip155.ts"

export const eip155 = {
  4326: {
    asset: Eip155Asset.Eip155Asset.make("0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7"),
    decimals: 18,
    name: "MegaUSD",
    version: "1",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
} as const satisfies References
