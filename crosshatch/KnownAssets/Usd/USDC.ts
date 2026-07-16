import type { References } from "../../Asset.ts"
import { Eip155Asset, Erc3009Scheme, Permit2Scheme } from "../../Eip155/Eip155.ts"
import { SolanaAsset, SolanaScheme, SolanaAddress } from "../../Solana/Solana.ts"

export const eip155 = {
  50: {
    asset: Eip155Asset.Eip155Asset.make("0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1", { disableChecks: true }),
    decimals: 6,
    name: "USDC",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
  137: {
    asset: Eip155Asset.Eip155Asset.make("0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", { disableChecks: true }),
    decimals: 6,
    name: "USD Coin",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
  143: {
    asset: Eip155Asset.Eip155Asset.make("0x754704Bc059F8C67012fEd69BC8A327a5aafb603", { disableChecks: true }),
    decimals: 6,
    name: "USD Coin",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
  8453: {
    asset: Eip155Asset.Eip155Asset.make("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", { disableChecks: true }),
    decimals: 6,
    name: "USD Coin",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
  42161: {
    asset: Eip155Asset.Eip155Asset.make("0xaf88d065e77c8cC2239327C5EDb3A432268e5831", { disableChecks: true }),
    decimals: 6,
    name: "USD Coin",
    version: "2",
    schemes: [Erc3009Scheme.Erc3009Scheme, Permit2Scheme.Permit2Scheme],
  },
} satisfies References

export const solana = {
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": {
    asset: SolanaAsset.SolanaAsset.make("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", { disableChecks: true }),
    decimals: 6,
    name: "USD Coin",
    version: "1",
    schemes: [SolanaScheme.SolanaScheme],
    metadata: {
      tokenProgramId: SolanaAddress.SolanaAddress.make("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", {
        disableChecks: true,
      }),
    },
  },
} satisfies References
