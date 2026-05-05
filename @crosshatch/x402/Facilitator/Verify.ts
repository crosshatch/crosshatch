import { Schema as S } from "effect"
import { HttpApiEndpoint, OpenApi } from "effect/unstable/httpapi"

import { Payload } from "../Payload.ts"
import { Requirements } from "../Requirements.ts"

export const Verify = HttpApiEndpoint.post("verify", "/verify", {
  payload: S.Struct({
    paymentPayload: Payload,
    paymentRequirements: Requirements,
  }),
  success: S.Union([
    S.Struct({
      isValid: S.tag(true),
      payer: S.String.pipe(S.optional),
      extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
    }),
    S.Struct({
      isValid: S.tag(false),
      invalidReason: S.String.pipe(S.optional),
      invalidMessage: S.String.pipe(S.optional),
    }),
  ]),
}).annotate(
  OpenApi.Description,
  `
    Verifies a payment authorization without executing the transaction on the blockchain.
    Returns whether the payment is valid, along with any invalidity reasons.
  `,
)
