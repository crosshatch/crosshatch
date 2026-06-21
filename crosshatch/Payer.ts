import { Context, Data, Effect } from "effect"

import type { TraceConfig } from "./Trace.ts"
import type { Payload, Required } from "./X402/X402.ts"

export class CreateTraceError extends Data.TaggedError("CreateTraceError")<{ readonly cause: unknown }> {}

export class CreatePayloadError extends Data.TaggedError("CreatePayloadError")<{ readonly cause: unknown }> {}

export class Payer extends Context.Service<
  Payer,
  {
    readonly createTrace: (config: typeof TraceConfig.Type) => Effect.Effect<void, CreateTraceError>

    readonly createPayload: (config: {
      readonly traceId?: string | undefined
      readonly required: typeof Required.Required.Type
    }) => Effect.Effect<{ readonly payload: typeof Payload.Payload.Type }, CreatePayloadError>
  }
>()("crosshatch/Payer") {}
