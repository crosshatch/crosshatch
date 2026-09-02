import { Effect, Pipeable, Types } from "effect"

import * as Address from "./Address.ts"
import type * as Amount from "./Amount.ts"
import type * as Instrument from "./Instrument.ts"
import type * as Namespace from "./Namespace.ts"
import type * as Payload from "./Payload.ts"
import type * as Required from "./Required.ts"
import * as Requirements from "./Requirements.ts"

const BuilderTypeId = "~crosshatch/Required/RequiredBuilder" as const

interface AcceptsBuilder<K extends string> extends Pipeable.Pipeable {
  readonly [BuilderTypeId]: typeof BuilderTypeId

  readonly _tag: K
}

// oxlint-disable-next-line typescript/no-empty-interface
export interface Empty extends AcceptsBuilder<"Empty"> {}

interface NonEmpty<K extends string> extends AcceptsBuilder<K> {
  readonly accepts: ReadonlyArray<ReadonlyArray<Requirements.Requirements>>

  readonly recipients: ReadonlyArray<Record<string, Address.Address>>
}

export interface Unaddressed<NamespaceShapes_ extends Namespace.NamespaceShape.Any> extends NonEmpty<"Unaddressed"> {
  readonly?: [NamespaceShapes_]
}

export interface Accepts extends NonEmpty<"Undescribed"> {
  (
    e0: string | TemplateStringsArray,
    ...substitutions: ReadonlyArray<string | number>
  ): Effect.Effect<Required.Required>

  readonly match: (payload: Payload.Payload | undefined) => boolean
}

export declare const empty: Empty

export declare const add: <T extends Instrument.InstrumentModule>(
  instruments: T,
  amount: Amount.AmountInput,
) => <NamespaceShapes_ extends Namespace.NamespaceShape.Any = never>(
  builder: Empty | Unaddressed<NamespaceShapes_> | Accepts,
) => Unaddressed<Instrument.InstrumentModule.ToInstruments<T>["namespace"]>

export declare const addUnit: <
  const T extends readonly [Instrument.InstrumentModule, ...ReadonlyArray<Instrument.InstrumentModule>],
>(
  instruments: T & [T[0], ...ReadonlyArray<Instrument.InstrumentModule<Instrument.InstrumentModule.Unit<T[0]>>>],
  amount: Amount.AmountInput,
) => <NamespaceShapes_ extends Namespace.NamespaceShape.Any = never>(
  builder: Empty | Unaddressed<NamespaceShapes_> | Accepts,
) => Unaddressed<Instrument.InstrumentModule.ToInstruments<T[number]>["namespace"]>

export declare const address: <NamespaceShapes_ extends Namespace.NamespaceShape.Any>(addresses: {
  readonly [K in NamespaceShapes_["_tag"]]: Types.ExtractTag<NamespaceShapes_, K>["address"]
}) => (builder: Unaddressed<NamespaceShapes_>) => Accepts
