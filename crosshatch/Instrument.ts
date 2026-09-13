import { type Effect, Data } from "effect"

import * as Proto from "./_Proto.ts"
import type * as Mechanism from "./Mechanism.ts"
import type { Requirements } from "./Requirements.ts"
import type * as Unit from "./Unit.ts"

const TypeId = Proto.id("Instrument")

export class InstrumentMetadataError extends Data.TaggedError("InstrumentMetadataError")<{
  readonly cause: unknown
}> {}

export interface InstrumentSpec<U extends Unit.Any, T, R, Mechanism_ extends Mechanism.Any> {
  readonly ""?: [Mechanism_]

  readonly accepts: (config: T) => Effect.Effect<ReadonlyArray<Requirements>, InstrumentMetadataError, R>

  readonly unit: U
}

export interface Instrument<U extends Unit.Any, T, R, Mechanism_ extends Mechanism.Any> extends InstrumentSpec<
  U,
  T,
  R,
  Mechanism_
> {
  readonly [TypeId]: typeof TypeId
}

export type Any<U extends Unit.Any = Unit.Any, A = any> = Instrument<U, A, any, Mechanism.Any>

export const make = <U extends Unit.Any, T, R, Mechanism_ extends Mechanism.Any>(
  spec: InstrumentSpec<U, T, R, Mechanism_>,
): Instrument<U, T, R, Mechanism_> => ({ [TypeId]: TypeId, ...spec })

export declare namespace Instrument {
  export type AcceptsServices<I extends Any> = never // TODO
}
