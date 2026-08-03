import { JsonRecord } from "@crosshatch/util/schema"
import { Schema as S, String, Tuple } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { ChainId } from "../ChainId.ts"
import { Payload } from "../Payload.ts"
import { Requirements } from "../Requirements.ts"

export type SettlePayload = typeof SettlePayload.Type
export const SettlePayload = S.Struct({
  paymentPayload: Payload,
  paymentRequirements: Requirements,
})

export type SettleResponse = typeof SettleResponse.Type
export const SettleResponse = S.Union([
  S.Struct({
    success: S.tag(true),
    payer: S.String.pipe(S.optional),
    transaction: S.String,
    network: ChainId,
    extensions: JsonRecord.pipe(S.optional),
  }),
  S.Struct({
    success: S.tag(false),
    errorReason: S.String.pipe(S.optional),
    errorMessage: S.String.pipe(S.optional),
  }),
]).mapMembers(
  Tuple.map(
    S.fieldsAssign({
      extra: JsonRecord.pipe(S.optional),
    }),
  ),
)
export const SettleResponseJson = S.toCodecJson(SettleResponse)
export const SettleResponseFromJsonString = S.fromJsonString(SettleResponseJson)
export const SettleResponseFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(SettleResponseFromJsonString))

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
