import { Schema as S, String, Tuple } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { ChainId, Payload, Requirements, Util } from "../index.ts"

export type SettlePayload = typeof SettlePayload.Type
export const SettlePayload = S.Struct({
  paymentPayload: Payload.Payload,
  paymentRequirements: Requirements.Requirements,
})

export type SettleResponse = typeof SettleResponse.Type
export const SettleResponse = S.Union([
  S.Struct({
    success: S.tag(true),
    payer: S.String.pipe(S.optional),
    transaction: S.String,
    network: ChainId.ChainId,
    extensions: Util.JsonRecord.pipe(S.optional),
  }),
  S.Struct({
    success: S.tag(false),
    errorReason: S.String.pipe(S.optional),
    errorMessage: S.String.pipe(S.optional),
  }),
]).mapMembers(
  Tuple.map(
    S.fieldsAssign({
      extra: Util.JsonRecord.pipe(S.optional),
    }),
  ),
)
export const SettleResponseJson = S.toCodecJson(SettleResponse)
export const SettleResponseJsonString = S.fromJsonString(SettleResponseJson)
export const SettleResponseFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(SettleResponseJsonString))

export const SettleEndpoint = HttpApiEndpoint.post("settle", "/settle", {
  payload: SettlePayload,
  success: SettleResponse,
}).annotate(
  OpenApi.Description,
  String.stripMargin(`
  | Executes a verified payment by broadcasting the transaction to the blockchain.
  | Returns the transaction hash and network on success, or an error reason on failure.
  `),
)
