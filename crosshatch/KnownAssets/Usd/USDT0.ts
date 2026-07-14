import type { References } from "../../Asset.ts"
import { Eip155Asset, Erc3009Scheme, Permit2Scheme } from "../../Eip155/Eip155.ts"

export const eip155 = {
  988: {
    asset: Eip155Asset.Eip155Asset.make("0x779Ded0c9e1022225f8E0630b35a9b54bE713736"),
    decimals: 6,
    name: "USDT0",
    version: "1",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
} as const satisfies References
