import { Effect } from "effect"

import { Erc3009Mechanism, Permit2Mechanism } from "../Eip155/index.ts"
import {
  ArbitrumMainnet,
  AvalancheMainnet,
  BaseMainnet,
  CeloMainnet,
  CodexMainnet,
  CronosMainnet,
  EdgeMainnet,
  EthereumMainnet,
  HyperEvmMainnet,
  IgraMainnet,
  InjectiveMainnet,
  InkMainnet,
  LineaMainnet,
  MonadMainnet,
  MorphMainnet,
  OptimismMainnet,
  PharosMainnet,
  PlasmaMainnet,
  PlumeMainnet,
  PolygonMainnet,
  SonicMainnet,
  UnichainMainnet,
  WorldChainMainnet,
  XdcMainnet,
  XLayerMainnet,
  ZkSyncMainnet,
} from "../Eip155/references.ts"
import { USDC } from "../families.ts"
import { Token } from "../index.ts"

const erc3009Config = Erc3009Mechanism.Erc3009Mechanism.make({
  name: "USD Coin",
  version: "2",
})

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "USD Coin",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

const xdcErc3009Config = Erc3009Mechanism.Erc3009Mechanism.make({
  name: "USDC",
  version: "2",
})

const xdcPermit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "USDC",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

const igraPermit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "USDC",
  version: "1",
  assetTransferMethod: "permit2",
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: USDC,
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const optimism_mainnet = Token.make({
  reference: OptimismMainnet,
  tokenFamily: USDC,
  address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const cronos_mainnet = Token.make({
  reference: CronosMainnet,
  tokenFamily: USDC,
  address: "0x3D7F2C478aAfdB65542BCB44bCeeC05849999d2D",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const xdc_mainnet = Token.make({
  reference: XdcMainnet,
  tokenFamily: USDC,
  address: "0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1",
  mechanismConfig: [xdcErc3009Config, xdcPermit2Config],
  decimals: Effect.succeed(6),
})

export const unichain_mainnet = Token.make({
  reference: UnichainMainnet,
  tokenFamily: USDC,
  address: "0x078D782b760474a361dDA0AF3839290b0EF57AD6",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const polygon_mainnet = Token.make({
  reference: PolygonMainnet,
  tokenFamily: USDC,
  address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const monad_mainnet = Token.make({
  reference: MonadMainnet,
  tokenFamily: USDC,
  address: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const sonic_mainnet = Token.make({
  reference: SonicMainnet,
  tokenFamily: USDC,
  address: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const x_layer_mainnet = Token.make({
  reference: XLayerMainnet,
  tokenFamily: USDC,
  address: "0xB6CEceAB302E2E4948951eE7843FC24E92933061",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const zk_sync_mainnet = Token.make({
  reference: ZkSyncMainnet,
  tokenFamily: USDC,
  address: "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const world_chain_mainnet = Token.make({
  reference: WorldChainMainnet,
  tokenFamily: USDC,
  address: "0x79A02482A880bCe3F13E09da970dC34dB4cD24D1",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const hyper_evm_mainnet = Token.make({
  reference: HyperEvmMainnet,
  tokenFamily: USDC,
  address: "0xb88339CB7199b77E23DB6E890353E22632Ba630f",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const pharos_mainnet = Token.make({
  reference: PharosMainnet,
  tokenFamily: USDC,
  address: "0xC879C018dB60520F4355C26eD1a6D572cdAC1815",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const injective_mainnet = Token.make({
  reference: InjectiveMainnet,
  tokenFamily: USDC,
  address: "0xa00C59fF5a080D2b954d0c75e46E22a0c371235a",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const morph_mainnet = Token.make({
  reference: MorphMainnet,
  tokenFamily: USDC,
  address: "0xCfb1186F4e93D60E60a8bDd997427D1F33bc372B",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const edge_mainnet = Token.make({
  reference: EdgeMainnet,
  tokenFamily: USDC,
  address: "0x98d2919b9A214E6Fa5384AC81E6864bA686Ad74c",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const base_mainnet = Token.make({
  reference: BaseMainnet,
  tokenFamily: USDC,
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const plasma_mainnet = Token.make({
  reference: PlasmaMainnet,
  tokenFamily: USDC,
  address: "0x2d661C89D812261039AF9764eceaAee884f5F67F",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const igra_mainnet = Token.make({
  reference: IgraMainnet,
  tokenFamily: USDC,
  address: "0xA5b8BF902b2844dA17d4506cc827F7F1681735E7",
  mechanismConfig: [igraPermit2Config],
  decimals: Effect.succeed(6),
})

export const arbitrum_mainnet = Token.make({
  reference: ArbitrumMainnet,
  tokenFamily: USDC,
  address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const celo_mainnet = Token.make({
  reference: CeloMainnet,
  tokenFamily: USDC,
  address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const avalanche_mainnet = Token.make({
  reference: AvalancheMainnet,
  tokenFamily: USDC,
  address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const ink_mainnet = Token.make({
  reference: InkMainnet,
  tokenFamily: USDC,
  address: "0x2D270e6886d130D724215A266106e6832161EAEd",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const linea_mainnet = Token.make({
  reference: LineaMainnet,
  tokenFamily: USDC,
  address: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const codex_mainnet = Token.make({
  reference: CodexMainnet,
  tokenFamily: USDC,
  address: "0xd996633a415985DBd7D6D12f4A4343E31f5037cf",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})

export const plume_mainnet = Token.make({
  reference: PlumeMainnet,
  tokenFamily: USDC,
  address: "0x222365EF19F7947e5484218551B56bb3965Aa7aF",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(6),
})
