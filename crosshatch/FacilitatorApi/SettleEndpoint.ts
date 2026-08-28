import { Schema as S, String, Tuple } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { Address } from "../Address.ts"
import { Atomic } from "../Amount.ts"
import { ChainId } from "../ChainId.ts"
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
    payer: Address.pipe(S.optional),
    transaction: S.String,
    network: ChainId,
  }),
  S.Struct({
    success: S.tag(false),
    payer: Address.pipe(S.optional),
    transaction: S.String,
    network: ChainId,
    errorReason: S.String.pipe(S.optional),
    errorMessage: S.String.pipe(S.optional),
  }),
]).mapMembers(
  Tuple.map(
    S.fieldsAssign({
      amount: Atomic.pipe(S.optional),
      extra: S.JsonObject.pipe(S.optional),
      extensions: S.JsonObject.pipe(S.optional),
    }),
  ),
)
export const SettleResponseJson = S.toCodecJson(SettleResponse)
export const SettleResponseFromJsonString = S.fromJsonString(SettleResponseJson)
export const SettleResponseFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(SettleResponseFromJsonString))

export class SettleEndpoint extends HttpApiEndpoint.post("settle", "/settle", {
  payload: SettlePayload,
  success: SettleResponse,
}).annotate(
  OpenApi.Description,
  String.stripMargin(`
  | Executes a verified payment by broadcasting the transaction to the blockchain.
  | Returns the transaction hash and network on success, or an error reason on failure.
  `),
) {}
