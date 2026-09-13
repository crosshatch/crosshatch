import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { AvalancheMainnet, CeloMainnet, EthereumMainnet } from "../Eip155/references.ts"
import { USDT } from "../families/index.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "Tether USD",
  version: "1",
  assetTransferMethod: "permit2",
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: USDT,
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const celo_mainnet = Token.make({
  reference: CeloMainnet,
  tokenFamily: USDT,
  address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})

export const avalanche_mainnet = Token.make({
  reference: AvalancheMainnet,
  tokenFamily: USDT,
  address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})
