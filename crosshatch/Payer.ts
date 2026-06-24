import { Context, Data, Effect, Layer } from "effect"

import { CaChain, CreatePayloadError } from "./Ca/Ca.ts"
import type { TraceConfig } from "./Trace.ts"
import type { Payload, Required } from "./X402/X402.ts"

export class CreateTraceError extends Data.TaggedError("CreateTraceError")<{ readonly cause: unknown }> {}

export class Payer extends Context.Service<
  Payer,
  {
    readonly createTrace?: undefined | ((config: typeof TraceConfig.Type) => Effect.Effect<void, CreateTraceError>)

    readonly createPayload: (config: {
      readonly traceId?: string | undefined
      readonly required: typeof Required.Required.Type
    }) => Effect.Effect<{ readonly payload: typeof Payload.Payload.Type }, CreatePayloadError>
  }
>()("crosshatch/Payer") {}

// TODO: configurable selection mechanism.
export const layerChain = (chain: CaChain.CaChain) =>
  Layer.succeed(Payer, {
    createPayload: ({ required }) =>
      chain.createPayload({
        requirements: required.accepts[0],
      }),
  })
