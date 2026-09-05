import { type Effect, Data } from "effect"

import type { AdaptEffect } from "./Adapt.ts"
import type * as Instrument from "./Instrument.ts"
import { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"

export class AllowError extends Data.TaggedError("AllowError")<{
  required: Required
  cause?: unknown
}> {}

export type Allow = (config: { readonly required: Required }) => Effect.Effect<
  {
    readonly accepted: Requirements
    readonly index: number
    readonly instrument: Instrument.Any
    readonly adapt: AdaptEffect<never>
  },
  AllowError
>

export declare const first: (instruments: ReadonlyArray<Instrument.InstrumentModule>) => Allow
