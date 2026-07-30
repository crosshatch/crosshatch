import type { References } from "../../Asset.ts"
import { Eip155Asset, Erc3009Scheme, Permit2Scheme } from "../../Eip155/Eip155.ts"
import { SolanaAsset, SolanaScheme, SolanaAddress } from "../../Solana/Solana.ts"

export const eip155 = {
  1: {
    asset: Eip155Asset.Eip155Asset.make("0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c", { disableChecks: true }),
    decimals: 6,
    name: "Euro Coin",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
  25: {
    asset: Eip155Asset.Eip155Asset.make("0xA6dE01a2d62C6B5f3525d768f34d276652C554c8", { disableChecks: true }),
    decimals: 6,
    name: "EURC",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
  480: {
    asset: Eip155Asset.Eip155Asset.make("0x1C60ba0A0eD1019e8Eb035E6daF4155A5cE2380B", { disableChecks: true }),
    decimals: 6,
    name: "EURC",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
  8453: {
    asset: Eip155Asset.Eip155Asset.make("0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42", { disableChecks: true }),
    decimals: 6,
    name: "EURC",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
  43114: {
    asset: Eip155Asset.Eip155Asset.make("0xC891EB4cbdEFf6e073e859e987815Ed1505c2ACD", { disableChecks: true }),
    decimals: 6,
    name: "Euro Coin",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
} as const satisfies References

export const solana = {
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": {
    asset: SolanaAsset.SolanaAsset.make("HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr", { disableChecks: true }),
    decimals: 6,
    name: "EURC",
    version: "1",
    schemes: [SolanaScheme.SolanaScheme],
    metadata: {
      tokenProgramId: SolanaAddress.SolanaAddress.make("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", {
        disableChecks: true,
      }),
    },
  },
} as const satisfies References
