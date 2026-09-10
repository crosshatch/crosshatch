import { Schema as S, Array, Effect } from "effect"

import type { InstrumentBearer } from "./Instrument.ts"
import * as Requirements from "./Requirements.ts"

export type Accepts = typeof Accepts.Type
export const Accepts = S.Array(Requirements.Requirements)

export const isAcceptable = (accepts: Accepts, requirements: Requirements.Requirements): boolean =>
  Array.some(accepts, (v) => Requirements.equals(v, requirements))

export const empty = Effect.succeed([])

export declare const add: <Mechanism_, T, E, R, E2, R2>(
  instrumentBearer: InstrumentBearer<Mechanism_, T, E, R>,
  config: T,
) => (self: Effect.Effect<Accepts, E2, R2>) => Effect.Effect<Accepts, E | E2, R | R2>
