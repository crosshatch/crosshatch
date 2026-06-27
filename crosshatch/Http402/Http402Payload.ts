import { Context, Schema as S, Effect } from "effect"
import { HttpServerResponse } from "effect/unstable/http"

import { Payload } from "../Payload.ts"
import { Required, RequiredFromBase64JsonString } from "../Required.ts"
import { TraceId } from "../traced.ts"
import { CROSSHATCH_TRACE_ID, PAYMENT_REQUIRED } from "./constants.ts"

export class Http402Payload extends Context.Service<Http402Payload, typeof Payload.Type | undefined>()(
  "crosshatch/http/Http402/Payload",
) {}

export const require = Effect.fnUntraced(function* (required: typeof Required.Type) {
  const traceId = yield* TraceId
  const paymentRequired = yield* S.encodeEffect(RequiredFromBase64JsonString)(required)
  return HttpServerResponse.empty({
    headers: {
      [PAYMENT_REQUIRED]: paymentRequired,
      ...(traceId && { [CROSSHATCH_TRACE_ID]: traceId }),
    },
  })
})
