import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { EthereumMainnet } from "../Eip155/references.ts"
import { USDe } from "../families/index.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "USDe",
  version: "1",
  assetTransferMethod: "permit2",
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: USDe,
  address: "0x4c9EDD5852cd905f086C759E8383e09b0b156bda",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})
