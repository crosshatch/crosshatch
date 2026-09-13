import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { EthereumMainnet } from "../Eip155/references.ts"
import { EURT } from "../families.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "Euro Tether",
  version: "1",
  assetTransferMethod: "permit2",
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: EURT,
  address: "0xC581b735A1688071A1746c968e0798D642EDE491",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})
