import { Effect } from "effect"

import { Erc3009Mechanism, Permit2Mechanism } from "../Eip155/index.ts"
import {
  ArbitrumMainnet,
  BerachainMainnet,
  ConfluxMainnet,
  FlareMainnet,
  HyperEvmMainnet,
  InkMainnet,
  MantleMainnet,
  MegaEthMainnet,
  MonadMainnet,
  MorphMainnet,
  OptimismMainnet,
  PlasmaMainnet,
  PolygonMainnet,
  RootstockMainnet,
  SeiMainnet,
  StableMainnet,
  TempoMainnet,
  UnichainMainnet,
  XLayerMainnet,
} from "../Eip155/references.ts"
import { USDT0 } from "../families/index.ts"
import { Token } from "../index.ts"

const erc3009Config = Erc3009Mechanism.Erc3009Mechanism.make({
  name: "USDT0",
  version: "1",
})

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "USDT0",
  version: "1",
  assetTransferMethod: "permit2",
})

export const optimism_mainnet = Token.make({
  reference: OptimismMainnet,
  tokenFamily: USDT0,
  address: "0x01bFF41798a0BcF287b996046Ca68b395DbC1071",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const flare_mainnet = Token.make({
  reference: FlareMainnet,
  tokenFamily: USDT0,
  address: "0xe7cd86e13AC4309349F30B3435a9d337750fC82D",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const rootstock_mainnet = Token.make({
  reference: RootstockMainnet,
  tokenFamily: USDT0,
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const unichain_mainnet = Token.make({
  reference: UnichainMainnet,
  tokenFamily: USDT0,
  address: "0x9151434b16b9763660705744891fA906F660EcC5",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const polygon_mainnet = Token.make({
  reference: PolygonMainnet,
  tokenFamily: USDT0,
  address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const monad_mainnet = Token.make({
  reference: MonadMainnet,
  tokenFamily: USDT0,
  address: "0xe7cd86e13AC4309349F30B3435a9d337750fC82D",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const x_layer_mainnet = Token.make({
  reference: XLayerMainnet,
  tokenFamily: USDT0,
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const stable_mainnet = Token.make({
  reference: StableMainnet,
  tokenFamily: USDT0,
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const hyper_evm_mainnet = Token.make({
  reference: HyperEvmMainnet,
  tokenFamily: USDT0,
  address: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const conflux_mainnet = Token.make({
  reference: ConfluxMainnet,
  tokenFamily: USDT0,
  address: "0xaf37E8B6C9ED7f6318979f56Fc287d76c30847ff",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const sei_mainnet = Token.make({
  reference: SeiMainnet,
  tokenFamily: USDT0,
  address: "0x9151434b16b9763660705744891fA906F660EcC5",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const morph_mainnet = Token.make({
  reference: MorphMainnet,
  tokenFamily: USDT0,
  address: "0xe7cd86e13AC4309349F30B3435a9d337750fC82D",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const tempo_mainnet = Token.make({
  reference: TempoMainnet,
  tokenFamily: USDT0,
  address: "0x20C00000000000000000000014f22CA97301EB73",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const mega_eth_mainnet = Token.make({
  reference: MegaEthMainnet,
  tokenFamily: USDT0,
  address: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const mantle_mainnet = Token.make({
  reference: MantleMainnet,
  tokenFamily: USDT0,
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const plasma_mainnet = Token.make({
  reference: PlasmaMainnet,
  tokenFamily: USDT0,
  address: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const arbitrum_mainnet = Token.make({
  reference: ArbitrumMainnet,
  tokenFamily: USDT0,
  address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const ink_mainnet = Token.make({
  reference: InkMainnet,
  tokenFamily: USDT0,
  address: "0x0200C29006150606B650577BBE7B6248F58470c1",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const berachain_mainnet = Token.make({
  reference: BerachainMainnet,
  tokenFamily: USDT0,
  address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})
