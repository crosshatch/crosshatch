import { Schema as S, Tuple } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { NetworkFromString } from "../Network.ts"
import { Payload } from "../Payload.ts"
import { Requirements } from "../Requirements.ts"
import { Version } from "../Version.ts"

export type SettlePayload = typeof SettlePayload.Type
export const SettlePayload = S.Struct({
  x402Version: Version,
  paymentPayload: Payload,
  paymentRequirements: Requirements,
})

export type SettleResponse = typeof SettleResponse.Type
export const SettleResponse = S.Union([
  S.Struct({
    success: S.tag(true),
    payer: S.NonEmptyString.pipe(S.optional),
    transaction: S.String,
    network: NetworkFromString,
  }),
  S.Struct({
    success: S.tag(false),
    payer: S.NonEmptyString.pipe(S.optional),
    transaction: S.String,
    network: NetworkFromString,
    errorReason: S.String.pipe(S.optional),
    errorMessage: S.String.pipe(S.optional),
  }),
]).mapMembers(
  Tuple.map(
    S.fieldsAssign({
      amount: S.NonEmptyString.pipe(S.optional),
      extra: S.JsonObject.pipe(S.optional),
      extensions: S.JsonObject.pipe(S.optional),
    }),
  ),
)
export const SettleResponseFromJsonString = S.fromJsonString(S.toCodecJson(SettleResponse))
export const SettleResponseFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(SettleResponseFromJsonString))

export class SettleEndpoint extends HttpApiEndpoint.post("settle", "/settle", {
  payload: SettlePayload,
  success: SettleResponse,
}).annotate(
  OpenApi.Description,
  `Settles a payment using its mechanism. Returns the settlement reference and network, or failure details.`,
) {}
