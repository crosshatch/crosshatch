import { Trace } from "crosshatch"
import { Context, Schema as S, Effect } from "effect"
import { HttpServerResponse } from "effect/unstable/http"

import { Payload, Required } from "../X402/X402.ts"
import { CROSSHATCH_TRACE_ID, PAYMENT_REQUIRED } from "./constants.ts"

export class Http402Payload extends Context.Service<Http402Payload, typeof Payload.Payload.Type | undefined>()(
  "crosshatch/http/Http402/Payload",
) {}

export const require = Effect.fnUntraced(function* (required: typeof Required.Required.Type) {
  const traceId = yield* Trace.TraceId
  const paymentRequired = yield* S.encodeEffect(Required.RequiredFromBase64JsonString)(required)
  return HttpServerResponse.empty({
    headers: {
      [PAYMENT_REQUIRED]: paymentRequired,
      ...(traceId && { [CROSSHATCH_TRACE_ID]: traceId }),
    },
  })
})
