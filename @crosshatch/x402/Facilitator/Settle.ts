import { ChainIdString } from "@crosshatch/caip"
import { UnknownRecord } from "@crosshatch/util/schema"
import { Schema as S } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { Payload } from "../Payload.ts"
import { Requirements } from "../Requirements.ts"

export const Settle = HttpApiEndpoint.post("settle", "/settle", {
  payload: S.Struct({
    paymentPayload: Payload,
    paymentRequirements: Requirements,
  }),
  success: S.Union([
    S.Struct({
      success: S.tag(true),
      payer: S.String.pipe(S.optional),
      transaction: S.String,
      network: ChainIdString,
      extensions: UnknownRecord.pipe(S.optional),
    }),
    S.Struct({
      success: S.tag(false),
      errorReason: S.String.pipe(S.optional),
      errorMessage: S.String.pipe(S.optional),
    }),
  ]),
}).annotate(
  OpenApi.Description,
  `
    Executes a verified payment by broadcasting the transaction to the blockchain.
    Returns the transaction hash and network on success, or an error reason on failure.
  `,
)
