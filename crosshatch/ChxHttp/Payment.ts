import { Effect, Schema as S } from "effect"

import type { AcceptError } from "../Accept.ts"
import { Payer } from "../Payer.ts"
import { PayloadFromBase64JsonString } from "../Payload.ts"
import type { CreatePayloadError } from "../Scheme.ts"
import { PAYMENT_SIGNATURE } from "./constants.ts"
import type { Resolver } from "./Resolver.ts"

export const resolver: Resolver<AcceptError | CreatePayloadError | S.SchemaError, Payer> = Effect.fnUntraced(
  function* ({ request, required, traceId }) {
    if (request.headers[PAYMENT_SIGNATURE] !== undefined) {
      return
    }
    const payer = yield* Payer
    const { payload } = yield* payer.createPayload({ required, traceId })
    return {
      headers: {
        [PAYMENT_SIGNATURE]: yield* S.encodeEffect(PayloadFromBase64JsonString)(payload),
      },
    }
  },
)
