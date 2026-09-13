import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import {
  ArbitrumMainnet,
  AvalancheMainnet,
  BaseMainnet,
  EthereumMainnet,
  OptimismMainnet,
  PolygonMainnet,
} from "../Eip155/references.ts"
import { DAI } from "../families.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "Dai Stablecoin",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: DAI,
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})

export const optimism_mainnet = Token.make({
  reference: OptimismMainnet,
  tokenFamily: DAI,
  address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})

export const polygon_mainnet = Token.make({
  reference: PolygonMainnet,
  tokenFamily: DAI,
  address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})

export const base_mainnet = Token.make({
  reference: BaseMainnet,
  tokenFamily: DAI,
  address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})

export const arbitrum_mainnet = Token.make({
  reference: ArbitrumMainnet,
  tokenFamily: DAI,
  address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})

export const avalanche_mainnet = Token.make({
  reference: AvalancheMainnet,
  tokenFamily: DAI,
  address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})
