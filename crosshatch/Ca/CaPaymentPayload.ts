import { Schema as S } from "effect"
import { Effect } from "effect"

import { Erc3009Payload, type EvmSigner, Permit2Payload } from "../Evm/Evm.ts"
import { SvmPayload } from "../Svm/Svm.ts"
import { Payload, Requirements } from "../X402/X402.ts"
import { CaPaymentPayloadMakeError } from "./errors.ts"

export const PaymentPayload = S.Union([
  Erc3009Payload.Erc3009Payload,
  Permit2Payload.Permit2Payload,
  SvmPayload.SvmPayload,
])

// TODO: use `CaSigner`
export const make = Effect.fnUntraced(
  function* (signer: EvmSigner.EvmSigner["Service"], requirements: typeof Requirements.Requirements.Type) {
    const method = requirements.extra?.assetTransferMethod ?? "eip3009"
    const payload = yield* (method === "permit2" ? Permit2Payload.make : Erc3009Payload.make)(signer, requirements)
    return {
      x402Version: 2,
      payload,
      accepted: requirements,
    } satisfies typeof Payload.Payload.Type
  },
  Effect.mapError(() => new CaPaymentPayloadMakeError()),
)
