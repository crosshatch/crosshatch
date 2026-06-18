import { Payload, Required } from "@crosshatch/x402"
import { TraceConfig } from "crosshatch"
import { Context, Effect, Data } from "effect"

import { CurrentTraceId } from "./Trace.ts"

export class CreateTraceError extends Data.TaggedError("CreateTraceError")<{ readonly cause: unknown }> {}

export class CreatePayloadError extends Data.TaggedError("CreatePayloadError")<{ readonly cause: unknown }> {}

export class Bridge extends Context.Service<
  Bridge,
  {
    readonly createTrace: (config: typeof TraceConfig.Type) => Effect.Effect<void, CreateTraceError>

    readonly createPayload: (config: {
      readonly traceId?: string | undefined
      readonly required: typeof Required.Required.Type
    }) => Effect.Effect<{ readonly payload: typeof Payload.Payload.Type }, CreatePayloadError>
  }
>()("@crosshatch/merchant/Bridge") {}

export const createPayload = Effect.fnUntraced(function* (required: typeof Required.Required.Type) {
  const { createPayload } = yield* Bridge
  const traceId = yield* CurrentTraceId
  const { payload } = yield* createPayload({ traceId, required })
  return payload
})
