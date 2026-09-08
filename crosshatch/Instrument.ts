import { Record, Array } from "effect"

import type { Requirements } from "./Requirements.ts"

export interface Instrument<Mechanism_, T> {
  ""?: [Mechanism_]
  (config: T): ReadonlyArray<Requirements>
}

export interface InstrumentBearer<Mechanism_, T> {
  readonly instrument: Instrument<Mechanism_, T>
}

export const merge =
  <Mechanism_, T>(v: Record<string, InstrumentBearer<Mechanism_, T>>): Instrument<Mechanism_, T> =>
  (config) =>
    Array.flatMap(Record.values(v), (v) => v.instrument(config))
