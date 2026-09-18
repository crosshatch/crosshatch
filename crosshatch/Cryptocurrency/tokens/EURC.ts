import { Effect } from "effect"

import { Erc3009Mechanism, Permit2Mechanism } from "../Eip155/index.ts"
import {
  AvalancheMainnet,
  BaseMainnet,
  CronosMainnet,
  EthereumMainnet,
  PlasmaMainnet,
  WorldChainMainnet,
} from "../Eip155/references.ts"
import { EURC } from "../families.ts"
import { Token } from "../index.ts"

const euroCoinErc3009Config = Erc3009Mechanism.Erc3009Mechanism.make({
  name: "Euro Coin",
  version: "2",
})

const euroCoinPermit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "Euro Coin",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

const eurcErc3009Config = Erc3009Mechanism.Erc3009Mechanism.make({
  name: "EURC",
  version: "2",
})

const eurcPermit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "EURC",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: EURC,
  address: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
  mechanismConfig: [euroCoinErc3009Config, euroCoinPermit2Config],
  decimals: Effect.succeed(6),
})

export const cronos_mainnet = Token.make({
  reference: CronosMainnet,
  tokenFamily: EURC,
  address: "0xA6dE01a2d62C6B5f3525d768f34d276652C554c8",
  mechanismConfig: [eurcErc3009Config, eurcPermit2Config],
  decimals: Effect.succeed(6),
})

export const world_chain_mainnet = Token.make({
  reference: WorldChainMainnet,
  tokenFamily: EURC,
  address: "0x1C60ba0A0eD1019e8Eb035E6daF4155A5cE2380B",
  mechanismConfig: [eurcErc3009Config, eurcPermit2Config],
  decimals: Effect.succeed(6),
})

export const base_mainnet = Token.make({
  reference: BaseMainnet,
  tokenFamily: EURC,
  address: "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
  mechanismConfig: [eurcErc3009Config, eurcPermit2Config],
  decimals: Effect.succeed(6),
})

export const plasma_mainnet = Token.make({
  reference: PlasmaMainnet,
  tokenFamily: EURC,
  address: "0x3EE196E78d4d4248b849B8E1C7F44C5457FAFD2C",
  mechanismConfig: [eurcErc3009Config, eurcPermit2Config],
  decimals: Effect.succeed(6),
})

export const avalanche_mainnet = Token.make({
  reference: AvalancheMainnet,
  tokenFamily: EURC,
  address: "0xC891EB4cbdEFf6e073e859e987815Ed1505c2ACD",
  mechanismConfig: [euroCoinErc3009Config, euroCoinPermit2Config],
  decimals: Effect.succeed(6),
})
