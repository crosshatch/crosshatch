import { Redacted, Effect, Config } from "effect"
import { Mnemonic } from "ox"
import { privateKeyToAccount } from "viem/accounts"

import { Requirements, Chain } from "../index.ts"
import * as Erc3009Payload from "./Erc3009Payload.ts"
import type { EvmSigner } from "./EvmSigner.ts"
import * as Permit2Payload from "./Permit2Payload.ts"

export class EvmChain extends Chain.Service<EvmChain>()("crosshatch/Evm/EvmChain") {}

// TODO: extensions + resource
export const fromSigner = (signer: EvmSigner): Chain.Chain => ({
  createPayload: Effect.fnUntraced(function* ({
    requirements,
  }: {
    readonly requirements: typeof Requirements.Requirements.Type
  }) {
    const method = requirements.extra?.assetTransferMethod ?? "eip3009"
    const payload = yield* (method === "permit2" ? Permit2Payload.make : Erc3009Payload.make)(signer, requirements)
    return {
      payload: {
        x402Version: 2,
        payload,
        accepted: requirements,
      },
    }
  }),
})

export const fromMnemonic = (mnemonic: Redacted.Redacted<string>) =>
  fromSigner(privateKeyToAccount(Mnemonic.toPrivateKey(Redacted.value(mnemonic), { as: "Hex" })))

export const fromMnemonicConfig = (mnemonicConfig: Config.Config<Redacted.Redacted<string>>) =>
  mnemonicConfig.pipe(Effect.map(fromMnemonic))
