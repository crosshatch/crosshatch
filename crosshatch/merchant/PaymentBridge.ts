import { AccountAddress } from "@crosshatch/caip"
import { Payload, Required } from "@crosshatch/x402"
import { Context, Effect, Data } from "effect"

import { TraceConfig } from "../TraceConfig.ts"

export class CreateRunError extends Data.TaggedError("CreateRunError")<{
  readonly cause: unknown
}> {}

export class CreateTraceError extends Data.TaggedError("CreateTraceError")<{
  readonly cause: unknown
}> {}

export class PaymentBridge extends Context.Service<
  PaymentBridge,
  {
    readonly createTrace: (config: typeof TraceConfig.Type) => Effect.Effect<void, CreateTraceError>

    readonly createPayload: (config: {
      readonly traceId?: string | undefined
      readonly required: typeof Required.Required.Type
    }) => Effect.Effect<
      {
        readonly from: typeof AccountAddress.Type
        readonly payload: typeof Payload.Payload.Type
      },
      CreateTraceError
    >
  }
>()("crosshatch/PaymentBridge") {}
