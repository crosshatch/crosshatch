import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { RadiusMainnet } from "../Eip155/references.ts"
import { SBC } from "../families.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "Stable Coin",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const radius_mainnet = Token.make({
  reference: RadiusMainnet,
  tokenFamily: SBC,
  address: "0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(6),
})
