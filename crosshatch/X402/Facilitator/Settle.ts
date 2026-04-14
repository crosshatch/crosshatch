import { UnknownRecord } from "@crosshatch/util/schema"
import { Schema as S } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { Network } from "../Network.ts"
import { Payload } from "../Payload.ts"
import { Requirements } from "../Requirements.ts"

export const Settle = HttpApiEndpoint.post("settle", "/settle", {
  payload: S.Struct({
    paymentPayload: Payload,
    paymentRequirements: Requirements,
  }),
  success: S.Struct({
    success: S.Boolean,
    errorReason: S.String.pipe(S.optional),
    errorMessage: S.String.pipe(S.optional),
    payer: S.String.pipe(S.optional),
    transaction: S.String,
    network: Network,
    extensions: UnknownRecord.pipe(S.optional),
  }),
}).annotate(
  OpenApi.Description,
  `
    Executes a verified payment by broadcasting the transaction to the blockchain.
    Returns the transaction hash and network on success, or an error reason on failure.
  `,
)
