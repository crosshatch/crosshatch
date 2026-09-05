import { Data, Context, Effect, type Layer } from "effect"

import type { Allow } from "./Allow.ts"
import type { Payload } from "./Payload.ts"
import type { Remote } from "./Remote.ts"
import type * as Required from "./Required.ts"

export class PayerError extends Data.TaggedError("PayerError")<{ readonly cause?: unknown }> {}

export type Make<R> = (required: Required.Required) => Effect.Effect<Payload, PayerError, R>

export class Payer extends Context.Service<
  Payer,
  {
    readonly make: Make<never>
  }
>()("crosshatch/Payer") {}

export const make: Make<Payer> = (required) => Payer.pipe(Effect.flatMap((v) => v.make(required)))

export declare const layer: (allow: Allow) => Layer.Layer<Payer>

export declare const layerRemote: Layer.Layer<Payer, never, Remote>
