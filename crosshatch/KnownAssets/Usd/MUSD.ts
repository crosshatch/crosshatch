import type { References } from "../../Asset.ts"
import { Eip155Asset, Erc3009Scheme, Permit2Scheme } from "../../Eip155/Eip155.ts"

export const eip155 = {
  31612: {
    asset: Eip155Asset.Eip155Asset.make("0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186"),
    decimals: 18,
    name: "Mezo USD",
    version: "1",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
} as const satisfies References
