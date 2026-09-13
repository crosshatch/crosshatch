import { Duration, Effect } from "effect"

import * as Proto from "../_Proto.ts"
import { Instrument, type MechanismConfig, type Mechanism } from "../index.ts"
import type { Address } from "./Address.ts"
import type * as Family from "./Family.ts"
import type * as Namespace from "./Namespace.ts"
import type * as Reference from "./Reference.ts"

const TypeId = Proto.id("Token")

export interface TokenSpec<
  Reference_ extends Reference.Any,
  Family_ extends Family.Any,
  AcceptsR,
  MechanismConfigs_ extends ReadonlyArray<MechanismConfig.Any>,
> {
  readonly reference: Reference_

  readonly tokenFamily: Family_

  readonly address: string

  readonly mechanismConfig: MechanismConfigs_

  readonly decimals: Effect.Effect<number, Instrument.InstrumentMetadataError, AcceptsR>
}

export interface TokenProps<Recipients> {
  readonly amount: string

  readonly recipients: Recipients

  readonly timeout?: Duration.Input | undefined
}

export interface Token<
  Reference_ extends Reference.Any,
  Family_ extends Family.Any,
  AcceptsR,
  Mechanism_ extends Mechanism.Any,
> extends Instrument.Instrument<
  Family_["unit"],
  TokenProps<{
    readonly [K in Reference_["namespace"]["_tag"]]: Address & Namespace.NamespaceBrand<K>
  }>,
  AcceptsR,
  Mechanism_
> {
  readonly [TypeId]: typeof TypeId

  readonly reference: Reference_

  readonly tokenFamily: Family_

  readonly address: string

  readonly mechanismConfig: ReadonlyArray<MechanismConfig.Any>

  readonly decimals: Effect.Effect<number, Instrument.InstrumentMetadataError, AcceptsR>
}

export type Any = Token<Reference.Any, Family.Any, any, any>

export type Mechanism<T extends Any> =
  T extends Token<Reference.Any, Family.Any, infer Mechanism_, any> ? Mechanism_ : never

export const make = <
  Reference_ extends Reference.Any,
  Family_ extends Family.Any,
  AcceptsR,
  MechanismConfigs_ extends ReadonlyArray<MechanismConfig.Any>,
>(
  spec: TokenSpec<Reference_, Family_, AcceptsR, MechanismConfigs_>,
): Token<Reference_, Family_, AcceptsR, MechanismConfigs_[number]["mechanism"]> => ({
  [TypeId]: TypeId,
  ...spec,
  ...Instrument.make({
    unit: spec.tokenFamily.unit,
    accepts: Effect.fnUntraced(function* (v) {
      const decimals = yield* spec.decimals
      decimals
      return spec.mechanismConfig.map((config) => ({
        scheme: "exact",
        network: {
          family: spec.reference.namespace._tag as never,
          reference: spec.reference._tag as never,
        },
        asset: spec.address,
        amount: v.amount,
        payTo: (v.recipients as never)[spec.reference.namespace._tag],
        maxTimeoutSeconds: v.timeout ? Duration.toSeconds(v.timeout) : 0,
        ...(config.extra ? { extra: config.extra } : {}),
      }))
    }),
  }),
})
