import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { EthereumMainnet } from "../Eip155/references.ts"
import { USDS } from "../families.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "USDS",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const ethereum_mainnet = Token.make({
  reference: EthereumMainnet,
  tokenFamily: USDS,
  address: "0xdC035D45d973E3EC169d2276DDab16f1e407384F",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})
