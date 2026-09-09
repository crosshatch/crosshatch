import { MechanismConfig } from "../../index.ts"
import { Erc3009, Permit2 } from "../../mechanisms/Eip155/index.ts"
import { TokenDeployment } from "../index.ts"
import { BaseMainnet } from "../references/Eip155.ts"
import { USDC } from "../tokens/index.ts"

const erc3009Config = MechanismConfig.make(Erc3009.Erc3009, {
  name: "USD Coin",
  version: "2",
})

const permit2Config = MechanismConfig.make(Permit2.Permit2, {
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
})

export const accepts = TokenDeployment.merge({ base_mainnet })
