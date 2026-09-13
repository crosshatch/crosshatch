import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { AvalancheMainnet, EthereumMainnet, PolygonMainnet } from "../Eip155/references.ts"
import { JPYC } from "../families/index.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "JPY Coin",
  version: "2",
  assetTransferMethod: "permit2",
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: JPYC,
  address: "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})

export const polygon_mainnet = Token.make({
  reference: PolygonMainnet,
  tokenFamily: JPYC,
  address: "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})

export const avalanche_mainnet = Token.make({
  reference: AvalancheMainnet,
  tokenFamily: JPYC,
  address: "0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})
