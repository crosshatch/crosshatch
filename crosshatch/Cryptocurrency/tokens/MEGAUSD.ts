import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { MegaEthMainnet } from "../Eip155/references.ts"
import { MEGAUSD } from "../families/index.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "MegaUSD",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const mega_eth_mainnet = Token.make({
  reference: MegaEthMainnet,
  tokenFamily: MEGAUSD,
  address: "0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})
