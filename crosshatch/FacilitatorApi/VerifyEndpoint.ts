import { JsonRecord } from "@crosshatch/util"
import { Schema as S, String, Tuple } from "effect"
import { HttpApiEndpoint, HttpApiError, OpenApi } from "effect/unstable/httpapi"

import { Address } from "../Address.ts"
import { Payload } from "../Payload.ts"
import { Requirements } from "../Requirements.ts"
import { Version } from "../Version.ts"

export type VerifyPayload = typeof VerifyPayload.Type
export const VerifyPayload = S.Struct({
  x402Version: Version,
  paymentPayload: Payload,
  paymentRequirements: Requirements,
})

export type VerifyResponse = typeof VerifyResponse
export const VerifyResponse = S.Union([
  S.Struct({
    isValid: S.tag(true),
    payer: Address.pipe(S.optional),
  }),
  S.Struct({
    isValid: S.tag(false),
    payer: Address.pipe(S.optional),
    invalidReason: S.String.pipe(S.optional),
    invalidMessage: S.String.pipe(S.optional),
  }),
]).mapMembers(
  Tuple.map(
    S.fieldsAssign({
      extra: JsonRecord.pipe(S.optional),
      extensions: JsonRecord.pipe(S.optional),
    }),
  ),
)
export const VerifyResponseJson = S.toCodecJson(VerifyResponse)
export const VerifyResponseJsonString = S.fromJsonString(VerifyResponseJson)

export class VerifyEndpoint extends HttpApiEndpoint.post("verify", "/verify", {
  payload: VerifyPayload,
  success: VerifyResponse,
  error: HttpApiError.ServiceUnavailable,
}).annotate(
  OpenApi.Description,
  String.stripMargin(`
  | Verifies a payment authorization without executing the transaction on the blockchain.
  | Returns whether the payment is valid, along with any invalidity reasons.
  `),
) {}
