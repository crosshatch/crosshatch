import { Schema as S } from "effect"
import { Effect } from "effect"

import * as Erc3009Payload from "./Evm/Erc3009Payload.ts"
import type { EvmSigner } from "./Evm/EvmSigner.ts"
import * as Permit2Payload from "./Evm/Permit2Payload.ts"
import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import * as SvmPayload from "./Svm/SvmPayload.ts"
import { Version } from "./Version.ts"

export const PaymentPayload = S.Union([
  Erc3009Payload.Erc3009Payload,
  Permit2Payload.Permit2Payload,
  SvmPayload.SvmPayload,
])

export const Payload = S.Struct({
  x402Version: Version,
  accepted: Requirements,
  extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
  payload: PaymentPayload,
  resource: ResourceInfo.pipe(S.optional),
})

export const make = Effect.fnUntraced(function* (signer: EvmSigner["Service"], requirements: typeof Requirements.Type) {
  const method = requirements.extra?.assetTransferMethod ?? "eip3009"
  const payload = yield* (method === "permit2" ? Permit2Payload.make : Erc3009Payload.make)(signer, requirements)
  return {
    x402Version: 2,
    payload,
    accepted: requirements,
  } satisfies typeof Payload.Type
})
