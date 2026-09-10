import type { Effect } from "effect"

import type { Requirements } from "./Requirements.ts"

export type InstrumentBase<T, E, R> = (config: T) => Effect.Effect<ReadonlyArray<Requirements>, E, R>

export interface Instrument<Mechanism_, T, E, R> extends InstrumentBase<T, E, R> {
  readonly ""?: [Mechanism_]
}

export interface InstrumentBearer<Mechanism_, T, E, R> {
  readonly accepts: Instrument<Mechanism_, T, E, R>
}
