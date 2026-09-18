import { Effect, Schema as S } from "effect"

import { instance } from "./_instance.ts"
import * as Proto from "./_Proto.ts"
import * as Address from "./Address.ts"
import * as Decimals from "./Decimals.ts"
import * as Namespace from "./Namespace.ts"
import * as Reference from "./Reference.ts"
import type * as Representation from "./Representation.ts"
import type { Requirements } from "./Requirements.ts"
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

  readonly reference: Reference.Reference<Namespace_, Reference_>

  readonly address: Address.Address<Namespace_>

  /** Undefined means unresolved, not zero or a namespace default. */
  readonly decimals: Decimals.Decimals | undefined

  readonly schemeEnvelopes: ReadonlyArray<SchemeEnvelope>
}

export type Any = Instrument<Representation.Any, Namespace.Any, string>

/** Checked synchronous construction for curated deployment declarations. */
export const make =
  <Representation_ extends Representation.Any, Namespace_ extends Namespace.Any>(
    representationClass: new () => Representation_,
    namespaceClass: new () => Namespace_,
  ) =>
  <Reference_ extends string>(spec: {
    readonly reference: Reference_
    readonly address: string
    readonly decimals?: number | undefined
    readonly schemeEnvelopes: ReadonlyArray<SchemeEnvelope>
  }): Instrument<Representation_, Namespace_, Reference_> => {
    const representation = instance(representationClass)
    const namespace = instance(namespaceClass)
    S.decodeSync(S.NonEmptyString)(representation.symbol)
    S.decodeSync(S.NonEmptyString)(representation.unit["~unit"])
    S.decodeSync(Namespace.NamespaceString)(namespace._tag)
    S.decodeSync(namespace.ReferenceString)(spec.reference)
    const address = Effect.runSync(Address.make(namespace.canonicalizeAddress(spec.address), namespaceClass))
    return {
      ...Proto.make(TypeId),
      representation,
      namespace,
      reference: Reference.make({ namespace, reference: spec.reference }),
      address,
      decimals: spec.decimals === undefined ? undefined : S.decodeSync(Decimals.Decimals)(spec.decimals),
      schemeEnvelopes: Object.freeze([...spec.schemeEnvelopes]),
    }
  }

/** Deployment identity excludes representation metadata and scheme capabilities. */
export const key = (instrument: Any): string =>
  `${instrument.namespace._tag}:${instrument.reference["~reference"]}:${instrument.address.raw}`

export const equals = (self: Any, that: Any): boolean => key(self) === key(that)

/** Finds the first deployment by CAIP-2 network and address; invalid addresses do not match. */
export const lookup = <I extends Any>(instruments: ReadonlyArray<I>, network: string, address: string): I | undefined =>
  instruments.find(
    (instrument) =>
      network === `${instrument.namespace._tag}:${instrument.reference["~reference"]}` &&
      S.is(instrument.namespace.AddressString)(address) &&
      instrument.namespace.canonicalizeAddress(address) === instrument.address.raw,
  )

export type InstrumentModule<U extends Unit.Any = Unit.Any> = Record<
  string,
  Representation.RepresentationClass<U, string> | Any
>

export declare namespace InstrumentModule {
  export type ToInstruments<M extends InstrumentModule> = { readonly [K in keyof M]: Extract<M[K], Any> }[keyof M]

  export type Unit<M extends InstrumentModule> = M extends InstrumentModule<infer U> ? U : never
}

export declare const matchRequirements: (
  instruments: ReadonlyArray<InstrumentModule>,
) => (requirements: Requirements) => boolean
