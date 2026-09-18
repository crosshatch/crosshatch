import { Schema as S, Array, Effect, Data } from "effect"

import type * as Instrument from "./Instrument.ts"
import * as Requirements from "./Requirements.ts"
import type * as Unit from "./Unit.ts"

export type Accepts = typeof Accepts.Type
export const Accepts = S.Array(Requirements.Requirements)

export class MakeAcceptsError extends Data.TaggedError("MakeAcceptsError")<{ readonly cause: unknown }> {}

export type MakeAccepts<T, R> = (
  config: T,
) => Effect.Effect<ReadonlyArray<Requirements.Requirements>, MakeAcceptsError, R>

export const isAcceptable = (accepts: Accepts, requirements: Requirements.Requirements): boolean =>
  Array.some(accepts, (v) => Requirements.equals(v, requirements))

export const empty = Effect.succeed([])

export declare const add: <T extends Unit.Any, U, Instruments_ extends Record<string, Instrument.Any<T, U>>>(
  instruments: Instruments_,
  config: U,
) => <E, R>(
  self: Effect.Effect<Accepts, E, R>,
) => Effect.Effect<Accepts, E, R | Instrument.Instrument.AcceptsServices<Instruments_[keyof Instruments_]>>

export declare const addInstrument: <T extends Unit.Any, U, Instrument_ extends Instrument.Any<T, U>>(
  instrument: Instrument_,
  config: U,
) => <E, R>(
  self: Effect.Effect<Accepts, E, R>,
) => Effect.Effect<Accepts, E, R | Instrument.Instrument.AcceptsServices<Instrument_>>
