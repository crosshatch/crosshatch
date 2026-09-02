import type * as Namespace from "./Namespace.ts"
import type * as Representation from "./Representation.ts"
import type * as Scheme from "./Scheme.ts"

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

export type InstrumentModule = Record<string, Representation.RepresentationClass.Any | Any>
export declare namespace InstrumentModule {
  export type ToInstruments<M extends InstrumentModule> = { [K in keyof M]: Extract<M[K], Any> }[keyof M]
}

export type InstrumentsInput = InstrumentModule | ReadonlyArray<InstrumentModule>

export type FromInput<I extends InstrumentsInput> =
  I extends ReadonlyArray<InstrumentModule>
    ? InstrumentModule.ToInstruments<I[number]>
    : I extends InstrumentModule
      ? InstrumentModule.ToInstruments<I>
      : never
