import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { ArbitrumMainnet, EthereumMainnet, PolygonMainnet, XLayerMainnet } from "../Eip155/references.ts"
import { PYUSD } from "../families.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "PayPal USD",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: PYUSD,
  address: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const polygon_mainnet = Token.make({
  reference: PolygonMainnet,
  tokenFamily: PYUSD,
  address: "0x99aF3EeA856556646C98c8B9b2548Fe815240750",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const x_layer_mainnet = Token.make({
  reference: XLayerMainnet,
  tokenFamily: PYUSD,
  address: "0x87b4a8176B3Df6b71e26CC095edcAf4Db07506B4",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const arbitrum_mainnet = Token.make({
  reference: ArbitrumMainnet,
  tokenFamily: PYUSD,
  address: "0x46850aD61C2B7d64d08c9C754F45254596696984",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})
