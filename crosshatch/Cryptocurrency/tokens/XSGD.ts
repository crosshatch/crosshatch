import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import {
  ArbitrumMainnet,
  AvalancheMainnet,
  BaseMainnet,
  EthereumMainnet,
  PolygonMainnet,
} from "../Eip155/references.ts"
import { XSGD } from "../families/index.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "XSGD",
  version: "1",
  assetTransferMethod: "permit2",
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: XSGD,
  address: "0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const polygon_mainnet = Token.make({
  reference: PolygonMainnet,
  tokenFamily: XSGD,
  address: "0xDC3326e71D45186F113a2F448984CA0e8D201995",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const base_mainnet = Token.make({
  reference: BaseMainnet,
  tokenFamily: XSGD,
  address: "0x0A4C9cb2778aB3302996A34BeFCF9a8Bc288C33b",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const arbitrum_mainnet = Token.make({
  reference: ArbitrumMainnet,
  tokenFamily: XSGD,
  address: "0xE333e7754a2DC1E020a162Ecab019254b9DaB653",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const avalanche_mainnet = Token.make({
  reference: AvalancheMainnet,
  tokenFamily: XSGD,
  address: "0xb2F85b7AB3c2b6f62DF06dE6aE7D09c010a5096E",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})
