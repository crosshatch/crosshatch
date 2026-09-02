import { type Effect, Data } from "effect"

import type * as Adapt from "./Adapt.ts"
import type * as Instrument from "./Instrument.ts"
import * as Required from "./Required.ts"
import type * as Requirements from "./Requirements.ts"

export class AcceptError extends Data.TaggedError("AcceptError")<{
  required: Required.Required
  cause?: unknown
}> {}

export type Accept = (config: { readonly required: Required.Required }) => Effect.Effect<
  {
    readonly accepted: Requirements.Requirements
    readonly index: number
    readonly instrument: Instrument.Any
    readonly adapt: Adapt.AdaptEffect<never>
  },
  AcceptError
>

export declare const first: (instruments: Instrument.InstrumentsInput) => Accept
