import type { Required } from "@crosshatch/x402"
import { Effect } from "effect"

import { Payer } from "./Payer.ts"
import { TraceId } from "./Trace.ts"

export const createPayload = Effect.fnUntraced(function* (required: typeof Required.Required.Type) {
  const { createPayload } = yield* Payer
  const traceId = yield* TraceId
  const { payload } = yield* createPayload({ required, traceId })
  return payload
})
