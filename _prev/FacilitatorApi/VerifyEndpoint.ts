import { Schema as S, String, Tuple } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { AddressFromString } from "../Address.ts"
import { Payload } from "../Payload.ts"
import { Requirements } from "../Requirements.ts"
import { Version } from "../Version.ts"

export type VerifyPayload = typeof VerifyPayload.Type
export const VerifyPayload = S.Struct({
  x402Version: Version,
  paymentPayload: Payload,
  paymentRequirements: Requirements,
})

export type VerifyResponse = typeof VerifyResponse.Type
export const VerifyResponse = S.Union([
  S.Struct({
    isValid: S.tag(true),
    payer: AddressFromString.pipe(S.optional),
  }),
  S.Struct({
    isValid: S.tag(false),
    payer: AddressFromString.pipe(S.optional),
    invalidReason: S.String.pipe(S.optional),
    invalidMessage: S.String.pipe(S.optional),
  }),
]).mapMembers(
  Tuple.map(
    S.fieldsAssign({
      extra: S.JsonObject.pipe(S.optional),
      extensions: S.JsonObject.pipe(S.optional),
    }),
  ),
)
export const VerifyResponseJson = S.toCodecJson(VerifyResponse)
export const VerifyResponseJsonString = S.fromJsonString(VerifyResponseJson)

export class VerifyEndpoint extends HttpApiEndpoint.post("verify", "/verify", {
  payload: VerifyPayload,
  success: VerifyResponse,
}).annotate(
  OpenApi.Description,
  String.stripMargin(`
  | Verifies a payment authorization without executing the transaction on the blockchain.
  | Returns whether the payment is valid, along with any invalidity reasons.
  `),
) {}
