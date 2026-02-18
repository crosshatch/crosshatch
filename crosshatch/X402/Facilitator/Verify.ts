import { description } from "@crosshatch/util/HttpApiUtil"
import { UnknownRecord } from "@crosshatch/util/schema"
import { HttpApiEndpoint } from "@effect/platform"
import { Schema as S } from "effect"

import { Payload } from "../Payload.ts"
import { Requirements } from "../Requirements.ts"

export const Verify = HttpApiEndpoint.post("verify")`/verify`
  .setPayload(
    S.Struct({
      paymentPayload: Payload,
      paymentRequirements: Requirements,
    }),
  )
  // TODO: narrowing
  .addSuccess(
    S.Struct({
      isValid: S.Boolean,
      invalidReason: S.String.pipe(S.optional),
      invalidMessage: S.String.pipe(S.optional),
      payer: S.String.pipe(S.optional),
      extensions: UnknownRecord.pipe(S.optional),
    }),
  )
  .pipe(
    description`
      Verifies a payment authorization without executing the transaction on the blockchain.
      Returns whether the payment is valid, along with any invalidity reasons.
    `,
  )
