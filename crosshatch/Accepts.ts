import { type Types, Pipeable, Predicate, Schema as S, SchemaGetter, Effect } from "effect"

import * as Proto from "./_Proto.ts"
import type { Address } from "./Address.ts"
import type { AmountInput } from "./Amount.ts"
import * as Instrument from "./Instrument.ts"
import * as Namespace from "./Namespace.ts"
import { Requirements } from "./Requirements.ts"
import * as Unit from "./Unit.ts"

const TypeId = Proto.id("Accepts")

export interface Accepts extends Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId

  "~accepts": ReadonlyArray<Requirements>
}

export const make = (v: ReadonlyArray<Requirements>): Accepts => ({ ...Proto.make(TypeId), "~accepts": v })

export const isAccepts = (v: unknown): v is Accepts => Predicate.hasProperty(v, TypeId)

export const Accepts = S.Array(Requirements).pipe(
  S.decodeTo(S.declare(isAccepts), {
    decode: SchemaGetter.transform(make),
    encode: SchemaGetter.transform(({ "~accepts": v }) => v),
  }),
)

export const add =
  (requirements: Requirements) =>
  (accepts: Accepts): Accepts =>
    make([...accepts["~accepts"], requirements])

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
