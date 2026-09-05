import { type Types, type Pipeable, Predicate, Schema as S, SchemaGetter, type Effect } from "effect"

import * as Proto from "./_Proto.ts"
import type { Address } from "./Address.ts"
import type { AmountInput } from "./Amount.ts"
import type * as Instrument from "./Instrument.ts"
import type * as Namespace from "./Namespace.ts"
import { Requirements } from "./Requirements.ts"
import type * as Unit from "./Unit.ts"

const TypeId = Proto.id("Accepts")

export interface Accepts extends Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId

  readonly raw: ReadonlyArray<Requirements>
}

export const make = (v: ReadonlyArray<Requirements>): Accepts => ({ ...Proto.make(TypeId), raw: v })

export const isAccepts = (v: unknown): v is Accepts => Predicate.hasProperty(v, TypeId)

export const Accepts = S.Array(Requirements).pipe(
  S.decodeTo(S.declare(isAccepts), {
    decode: SchemaGetter.transform(make),
    encode: SchemaGetter.transform((v) => v.raw),
  }),
)

export const add =
  (requirements: Requirements) =>
  (accepts: Accepts): Accepts =>
    make([...accepts.raw, requirements])

export const empty: Accepts = make([])

const AcceptsPartialTypeId = Proto.id("Accepts/AcceptsPartial")

export interface AcceptsPartial<NamespaceShapes_ extends Namespace.Any> {
  readonly [AcceptsPartialTypeId]: typeof AcceptsPartialTypeId

  readonly ""?: [NamespaceShapes_]

  readonly pending: Effect.Effect<Accepts>

  readonly partials: ReadonlyArray<[Instrument.Any, AmountInput]>
}

export declare const addInstrument: <T extends Instrument.InstrumentModule>(
  instruments: T,
  amount: AmountInput,
) => <NamespaceShapes_ extends Namespace.Any = never>(
  builder: Accepts | AcceptsPartial<NamespaceShapes_>,
) => AcceptsPartial<Instrument.InstrumentModule.ToInstruments<T>["namespace"]>

export declare const addUnit: <U extends Unit.Any, const T extends ReadonlyArray<Instrument.InstrumentModule<U>>>(
  unit: U,
  instruments: T,
  amount: AmountInput,
) => <Namespace_ extends Namespace.Any = never>(
  builder: Accepts | AcceptsPartial<Namespace_>,
) => AcceptsPartial<Namespace_ | Instrument.InstrumentModule.ToInstruments<T[number]>["namespace"]>

export declare const address: <Namespace_ extends Namespace.Any>(addresses: {
  readonly [K in Namespace_["_tag"]]: Address<Types.ExtractTag<Namespace_, K>>
}) => (builder: AcceptsPartial<Namespace_>) => Accepts
