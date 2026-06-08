import { Effect } from "effect"

import { handler } from "../_httpapi_util.ts"
import { Api } from "../Api.ts"
import { verify } from "../verify.ts"

export const handleVerify = handler(
  Api,
  "facilitator",
  "verify",
  ({ payload: { paymentPayload: payload, paymentRequirements: requirements } }) =>
    verify({ payload, requirements }).pipe(Effect.orDie),
)
