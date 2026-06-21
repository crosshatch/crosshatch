import { Effect } from "effect"

import { Payer } from "./Payer.ts"
import { TraceConfig, TraceId } from "./Trace.ts"
import type { Required } from "./X402/X402.ts"

export const createTrace = (config: typeof TraceConfig.Type) =>
  Payer.pipe(Effect.flatMap(({ createTrace }) => createTrace(config)))

export const createPayload = Effect.fnUntraced(function* ({ required }: { required: typeof Required.Required.Type }) {
  const { createPayload } = yield* Payer
  const traceId = yield* TraceId
  return yield* createPayload({ required, traceId })
})
