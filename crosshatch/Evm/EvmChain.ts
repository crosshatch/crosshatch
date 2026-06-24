import { Context, Redacted } from "effect"
import { Effect } from "effect"
import { Mnemonic } from "ox"
import { privateKeyToAccount } from "viem/accounts"

import { CaChain } from "../Ca/Ca.ts"
import { Requirements } from "../X402/X402.ts"
import * as Erc3009Payload from "./Erc3009Payload.ts"
import type { EvmSigner } from "./EvmSigner.ts"
import * as Permit2Payload from "./Permit2Payload.ts"

export class EvmChain extends Context.Service<EvmChain, CaChain.CaChain>()("crosshatch/Evm/EvmChain") {}

// TODO: extensions + resource
export const fromSigner = (signer: EvmSigner): CaChain.CaChain => ({
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
