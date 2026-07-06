import { Schema as S, String } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { ExtensionsInfo } from "../../Extension.ts"
import * as Extra from "../../Extra.ts"
import { Payload } from "../../Payload.ts"
import { Requirements } from "../../Requirements.ts"

export const VerifyPayload = S.Struct({
  paymentPayload: Payload,
  paymentRequirements: Requirements,
})

export const VerifyResponse = S.Union([
  S.Struct({
    isValid: S.tag(true),
    payer: S.String.pipe(S.optional),
    extensions: ExtensionsInfo.pipe(S.optional),
  }),
  S.Struct({
    isValid: S.tag(false),
    invalidReason: S.String.pipe(S.optional),
    invalidMessage: S.String.pipe(S.optional),
  }),
]).mapMembers(Extra.assign)

export const VerifyEndpoint = HttpApiEndpoint.post("verify", "/verify", {
  payload: VerifyPayload,
  success: VerifyResponse,
}).annotate(
  OpenApi.Description,
  String.stripMargin(`
  | Verifies a payment authorization without executing the transaction on the blockchain.
  | Returns whether the payment is valid, along with any invalidity reasons.
  `),
)
