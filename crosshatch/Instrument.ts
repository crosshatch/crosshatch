import type { Requirements } from "./Requirements.ts"

export type InstrumentBase<T> = (config: T) => ReadonlyArray<Requirements>

export interface Instrument<Mechanism_, T> extends InstrumentBase<T> {
  readonly ""?: [Mechanism_]
}

export interface InstrumentBearer<Mechanism_, T> {
  readonly accepts: Instrument<Mechanism_, T>
}
