import type { References } from "../../Asset.ts"
import { Eip155Asset, Permit2Scheme } from "../../Eip155/index.ts"

export const eip155 = {
  1: {
    asset: Eip155Asset.Eip155Asset.make("0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB", { disableChecks: true }),
    decimals: 18,
    name: "JPY Coin",
    version: "2",
    schemes: [Permit2Scheme.Permit2Scheme],
  },
  137: {
    asset: Eip155Asset.Eip155Asset.make("0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB", { disableChecks: true }),
    decimals: 18,
    name: "JPY Coin",
    version: "2",
    schemes: [Permit2Scheme.Permit2Scheme],
  },
  43114: {
    asset: Eip155Asset.Eip155Asset.make("0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB", { disableChecks: true }),
    decimals: 18,
    name: "JPY Coin",
    version: "2",
    schemes: [Permit2Scheme.Permit2Scheme],
  },
} as const satisfies References
