import { Data, Context, Effect, type Layer, type Schema as S } from "effect"

import type { Payload } from "./Payload.ts"
import type * as Required from "./Required.ts"

export class PayerError extends Data.TaggedError("PayerError")<{
  readonly reason: S.SchemaError
}> {}

export class Payer extends Context.Service<
  Payer,
  (required: Required.Required) => Effect.Effect<Payload, PayerError>
>()("crosshatch/Payer") {}

export const make = (required: Required.Required): Effect.Effect<Payload, PayerError, Payer> =>
  Payer.pipe(Effect.flatMap((f) => f(required)))

export declare const layer: Layer.Layer<Payer>
