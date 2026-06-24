import { Effect } from "effect"

import { Payer } from "./Payer.ts"
import { TraceConfig } from "./Trace.ts"
import type { Required } from "./X402/X402.ts"

export const createTrace = Effect.fnUntraced(function* (config: typeof TraceConfig.Type) {
  const { createTrace } = yield* Payer
  return yield* createTrace?.(config) ?? Effect.void
})

export const createPayload = Effect.fnUntraced(function* ({
  required,
  traceId,
}: {
  readonly required: typeof Required.Required.Type
  readonly traceId?: string | undefined
}) {
  const { createPayload } = yield* Payer
  return yield* createPayload({ required, traceId })
})
