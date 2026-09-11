import { Effect } from "effect"

import { MechanismConfig } from "../../index.ts"
import { Erc3009Mechanism, Permit2Mechanism } from "../Eip155/index.ts"
import { TokenDeployment, TokenDeploymentGroup } from "../index.ts"
import { BaseMainnet } from "../references/Eip155.ts"
import { USDC } from "../tokens/index.ts"

const erc3009Config = MechanismConfig.make(Erc3009Mechanism.Erc3009Mechanism, {
  name: "USD Coin",
  version: "2",
})

const permit2Config = MechanismConfig.make(Permit2Mechanism.Permit2Scheme, {
  name: "USD Coin",
  version: "2",
  assetTransferMethod: "permit2",
  supportsEip2612: true,
})

export const base_mainnet = TokenDeployment.make({
  reference: BaseMainnet,
  token: USDC,
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  mechanismConfig: [erc3009Config, permit2Config],
  decimals: Effect.succeed(18),
})

export const accepts = TokenDeploymentGroup.make({ base_mainnet })
