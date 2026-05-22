import { Required } from "@crosshatch/x402"
import { Schema as S } from "effect"

import { PaymentContext } from "./PaymentContext.ts"

export const RequiredEnvelope = S.Struct({
  required: Required.Required,
  context: PaymentContext.pipe(S.optional),
})
