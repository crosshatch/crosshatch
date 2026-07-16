import type { References } from "../../Asset.ts"
import { Eip155Asset, Erc3009Scheme, Permit2Scheme } from "../../Eip155/Eip155.ts"

export const eip155 = {
  723487: {
    asset: Eip155Asset.Eip155Asset.make("0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb", { disableChecks: true }),
    decimals: 6,
    name: "Stable Coin",
    version: "1",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
} as const satisfies References
