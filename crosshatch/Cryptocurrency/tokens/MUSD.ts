import { Effect } from "effect"

import { Permit2Mechanism } from "../Eip155/index.ts"
import { MezoMainnet } from "../Eip155/references.ts"
import { MUSD } from "../families.ts"
import { Token } from "../index.ts"

const permit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "Mezo USD",
  version: "1",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const mezo_mainnet = Token.make({
  reference: MezoMainnet,
  tokenFamily: MUSD,
  address: "0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186",
  mechanismConfig: [permit2Config],
  decimals: Effect.succeed(18),
})
