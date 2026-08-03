import type { References } from "../../Asset.ts"
import { Eip155Asset, Permit2Scheme } from "../../Eip155/index.ts"
import { SolanaAsset, SolanaScheme, SolanaAddress } from "../../Solana/index.ts"

export const eip155 = {
  1: {
    asset: Eip155Asset.Eip155Asset.make("0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96", { disableChecks: true }),
    decimals: 6,
    name: "XSGD",
    version: "1",
    schemes: [Permit2Scheme.Permit2Scheme],
  },
  137: {
    asset: Eip155Asset.Eip155Asset.make("0xDC3326e71D45186F113a2F448984CA0e8D201995", { disableChecks: true }),
    decimals: 6,
    name: "XSGD",
    version: "1",
    schemes: [Permit2Scheme.Permit2Scheme],
  },
  8453: {
    asset: Eip155Asset.Eip155Asset.make("0x0A4C9cb2778aB3302996A34BeFCF9a8Bc288C33b", { disableChecks: true }),
    decimals: 6,
    name: "XSGD",
    version: "1",
    schemes: [Permit2Scheme.Permit2Scheme],
  },
  42161: {
    asset: Eip155Asset.Eip155Asset.make("0xE333e7754a2DC1E020a162Ecab019254b9DaB653", { disableChecks: true }),
    decimals: 6,
    name: "XSGD",
    version: "1",
    schemes: [Permit2Scheme.Permit2Scheme],
  },
  43114: {
    asset: Eip155Asset.Eip155Asset.make("0xb2F85b7AB3c2b6f62DF06dE6aE7D09c010a5096E", { disableChecks: true }),
    decimals: 6,
    name: "XSGD",
    version: "1",
    schemes: [Permit2Scheme.Permit2Scheme],
  },
} as const satisfies References

export const solana = {
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": {
    asset: SolanaAsset.SolanaAsset.make("71S9cppWipeUEQDFngYwxjoxB6Sz1MUqX72byLsVYJqy", { disableChecks: true }),
    decimals: 6,
    name: "XSGD",
    version: "1",
    schemes: [SolanaScheme.SolanaScheme],
    metadata: {
      tokenProgramId: SolanaAddress.SolanaAddress.make("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", {
        disableChecks: true,
      }),
    },
  },
} as const satisfies References
