import type * as Namespace from "./Namespace.ts"
import type * as Representation from "./Representation.ts"
import type * as Scheme from "./Scheme.ts"
import type * as Unit from "./Unit.ts"

const TypeId = "~crosshatch/Instrument" as const

export interface Instrument<
  Representation_ extends Representation.Any,
  NamespaceShape_ extends Namespace.NamespaceShape.Any,
  Reference extends string,
> {
  readonly [TypeId]: typeof TypeId

  readonly representation: Representation_

  readonly namespace: NamespaceShape_

  readonly reference: Reference
}

export type Any = Instrument<Representation.Any, Namespace.NamespaceShape.Any, string>

export declare const make: <
  Representation_ extends Representation.Any,
  NamespaceShape_ extends Namespace.NamespaceShape.Any,
>(
  representation: new () => Representation_,
  namespace: new (_: never) => NamespaceShape_,
) => <Reference extends string>(spec: {
  reference: Reference
  address: string
  schemeEnvelopes: ReadonlyArray<Scheme.SchemeEnvelope>
}) => Instrument<Representation_, NamespaceShape_, Reference>

export type InstrumentModule<U extends Unit.Any = Unit.Any> = Record<
  string,
  Representation.RepresentationClass<string, U> | Any
>

export declare namespace InstrumentModule {
  export type ToInstruments<M extends InstrumentModule> = { [K in keyof M]: Extract<M[K], Any> }[keyof M]

  export type Unit<M extends InstrumentModule> = M extends InstrumentModule<infer U> ? U : never
}
