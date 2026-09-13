import { Effect } from "effect"

import { Erc3009Mechanism, Permit2Mechanism } from "../Eip155/index.ts"
import { AdiMainnet, HppMainnet } from "../Eip155/references.ts"
import { USDCE } from "../families.ts"
import { Token } from "../index.ts"

const adiErc3009Config = Erc3009Mechanism.Erc3009Mechanism.make({
  name: "USDC.e",
  version: "2",
})

const adiPermit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "USDC.e",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

const hppErc3009Config = Erc3009Mechanism.Erc3009Mechanism.make({
  name: "Bridged USDC",
  version: "2",
})

const hppPermit2Config = Permit2Mechanism.Permit2Scheme.make({
  name: "Bridged USDC",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const adi_mainnet = Token.make({
  reference: AdiMainnet,
  tokenFamily: USDCE,
  address: "0x9cb8142aEBBcdc60AF7c97Af897A67A8f3CA71C2",
  mechanismConfig: [adiErc3009Config, adiPermit2Config],
  decimals: Effect.succeed(6),
})

export const hpp_mainnet = Token.make({
  reference: HppMainnet,
  tokenFamily: USDCE,
  address: "0x401eCb1D350407f13ba348573E5630B83638E30D",
  mechanismConfig: [hppErc3009Config, hppPermit2Config],
  decimals: Effect.succeed(6),
})
