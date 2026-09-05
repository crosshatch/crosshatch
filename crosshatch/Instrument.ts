import * as Proto from "./_Proto.ts"
import type * as Namespace from "./Namespace.ts"
import type { Reference } from "./Reference.ts"
import type * as Representation from "./Representation.ts"
import type { SchemeEnvelope } from "./Scheme.ts"
import type * as Unit from "./Unit.ts"

const TypeId = Proto.id("Instrument")

export interface Instrument<
  Representation_ extends Representation.Any,
  Namespace_ extends Namespace.Any,
  Reference_ extends string,
> {
  readonly [TypeId]: typeof TypeId

  readonly representation: Representation_

  readonly namespace: Namespace_

  readonly reference: Reference<Namespace_, Reference_>
}

export type Any = Instrument<Representation.Any, Namespace.Any, string>

export declare const make: <Representation_ extends Representation.Any, Namespace_ extends Namespace.Any>(
  representation: new () => Representation_,
  namespace: new () => Namespace_,
) => <Reference extends string>(spec: {
  reference: Reference
  address: string
  schemeEnvelopes: ReadonlyArray<SchemeEnvelope>
}) => Instrument<Representation_, Namespace_, Reference>

export type InstrumentModule<U extends Unit.Any = Unit.Any> = Record<
  string,
  Representation.RepresentationClass<U, string> | Any
>

export declare namespace InstrumentModule {
  export type ToInstruments<M extends InstrumentModule> = { [K in keyof M]: Extract<M[K], Any> }[keyof M]

  export type Unit<M extends InstrumentModule> = M extends InstrumentModule<infer U> ? U : never
}
