import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { EthereumMainnet } from "../Eip155/references.ts"
import { RLUSD } from "../families.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "RLUSD",
  version: "1",
  assetTransferMethod: "permit2",
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: RLUSD,
  address: "0x8292Bb45bf1Ee4d140127049757C2E0fF06317eD",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})
