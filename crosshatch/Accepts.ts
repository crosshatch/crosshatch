import { Pipeable, Predicate, Schema as S, SchemaGetter } from "effect"

import * as Proto from "./_Proto.ts"
import type * as Instrument from "./Instrument.ts"
import { Requirements } from "./Requirements.ts"

const TypeId = Proto.id("Accepts")

export type RequirementsArray = typeof RequirementsArray.Type
export const RequirementsArray = S.Array(Requirements)

export interface Accepts extends Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId

  readonly accepts: RequirementsArray
}

export const make = (accepts: RequirementsArray): Accepts => ({
  [TypeId]: TypeId,
  accepts,
  pipe() {
    return Pipeable.pipeArguments(this, arguments)
  },
})

export const isAccepts = (v: unknown): v is Accepts => Predicate.hasProperty(v, TypeId)

export const empty: Accepts = make([])

export const add =
  <Mechanism_, T>(source: Instrument.InstrumentBearer<Mechanism_, T>, config: T) =>
  (accepts: Accepts): Accepts =>
    make([...accepts.accepts, ...source.instrument(config)])

export const AcceptsFromRequirementsArray = RequirementsArray.pipe(
  S.decodeTo(S.declare(isAccepts), {
    decode: SchemaGetter.transform(make),
    encode: SchemaGetter.transform((v) => v.accepts),
  }),
)
