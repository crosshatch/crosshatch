import { Data, Context, type Effect, type Layer } from "effect"

import type * as Accept from "./Accept.ts"
import type * as Payload from "./Payload.ts"
import type * as Required from "./Required.ts"

export class PayerError extends Data.TaggedError("PayerError")<{ readonly cause?: unknown }> {}

export interface Service {
  readonly make: (required: Required.Required) => Effect.Effect<Payload.Payload, PayerError>
}

export class Payer extends Context.Service<Payer, Service>()("crosshatch/Payer") {}

export declare const layer: (accepts: Accept.Accept) => Layer.Layer<Payer>
