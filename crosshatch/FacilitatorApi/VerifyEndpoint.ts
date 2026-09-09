import { Schema as S, Tuple } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

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
    payer: S.NonEmptyString.pipe(S.optional),
  }),
  S.Struct({
    isValid: S.tag(false),
    payer: S.NonEmptyString.pipe(S.optional),
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
export const VerifyResponseFromJsonString = S.fromJsonString(S.toCodecJson(VerifyResponse))

export class VerifyEndpoint extends HttpApiEndpoint.post("verify", "/verify", {
  payload: VerifyPayload,
  success: VerifyResponse,
}).annotate(
  OpenApi.Description,
  `Validates a payment authorization against the supplied requirements without settling the payment. Returns whether the payment is valid, along with any invalidity reasons.`,
) {}
