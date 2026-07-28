import type { References } from "../../Asset.ts"
import { Eip155Asset, Erc3009Scheme, Permit2Scheme } from "../../Eip155/Eip155.ts"

export const eip155 = {
  36900: {
    asset: Eip155Asset.Eip155Asset.make("0x9cb8142aEBBcdc60AF7c97Af897A67A8f3CA71C2", { disableChecks: true }),
    decimals: 6,
    name: "USDC.e",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
  190415: {
    asset: Eip155Asset.Eip155Asset.make("0x401eCb1D350407f13ba348573E5630B83638E30D", { disableChecks: true }),
    decimals: 6,
    name: "Bridged USDC",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
} as const satisfies References
