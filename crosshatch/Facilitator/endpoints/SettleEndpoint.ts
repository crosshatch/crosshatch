import { Schema as S, String } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { ChainId } from "../../ChainId.ts"
import { Payload } from "../../Payload.ts"
import { Requirements } from "../../Requirements.ts"

export const SettleEndpoint = HttpApiEndpoint.post("settle", "/settle", {
  payload: S.Struct({
    paymentPayload: Payload,
    paymentRequirements: Requirements,
  }),
  success: S.Union([
    S.Struct({
      success: S.tag(true),
      payer: S.String.pipe(S.optional),
      transaction: S.String,
      network: ChainId,
      extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
    }),
    S.Struct({
      success: S.tag(false),
      errorReason: S.String.pipe(S.optional),
      errorMessage: S.String.pipe(S.optional),
    }),
  ]),
}).annotate(
  OpenApi.Description,
  String.stripMargin(`
  | Executes a verified payment by broadcasting the transaction to the blockchain.
  | Returns the transaction hash and network on success, or an error reason on failure.
  `),
)
