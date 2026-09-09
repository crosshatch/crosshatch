import { Duration, Array, Record } from "effect"

import * as Proto from "../_Proto.ts"
import type { Instrument, MechanismConfig } from "../index.ts"
import type * as Namespace from "./Namespace.ts"
import type * as Reference from "./Reference.ts"
import type * as Token from "./Token.ts"

const TypeId = Proto.id("TokenDeployment")

export interface TokenDeploymentSpec<
  Namespace_ extends Namespace.Any,
  MechanismConfigs_ extends ReadonlyArray<MechanismConfig.Any>,
  Reference_ extends string,
  Token_ extends Token.Any,
> {
  readonly reference: Reference.Reference<Namespace_, Reference_>

  readonly token: Token_

  readonly address: string

  readonly mechanismConfig: MechanismConfigs_
}

export interface TokenDeploymentProps<Namespace_ extends Namespace.Any> {
  readonly amount: string

  readonly recipients: {
    readonly [K in Namespace_["_tag"]]: Namespace_["Address"]["Type"]
  }

  readonly timeout?: Duration.Input | undefined
}

export interface TokenDeployment<
  Namespace_ extends Namespace.Any,
  Mechanism_,
  Reference_ extends string,
  Token_ extends Token.Any,
> extends Instrument.InstrumentBearer<Mechanism_, TokenDeploymentProps<Namespace_>> {
  readonly [TypeId]: typeof TypeId

  readonly reference: Reference.Reference<Namespace_, Reference_>

  readonly token: Token_

  readonly address: string

  readonly mechanismConfig: ReadonlyArray<MechanismConfig.Any>
}

export type Any = TokenDeployment<Namespace.Any, any, string, Token.Any>

export const make = <
  Namespace_ extends Namespace.Any,
  MechanismConfigs_ extends ReadonlyArray<MechanismConfig.Any>,
  Reference_ extends string,
  Token_ extends Token.Any,
>(
  spec: TokenDeploymentSpec<Namespace_, MechanismConfigs_, Reference_, Token_>,
): TokenDeployment<
  Namespace_,
  MechanismConfigs_[number] extends MechanismConfig.MechanismConfig<infer Mechanism_>
    ? Mechanism_["Identifier"]
    : never,
  Reference_,
  Token_
> => ({
  [TypeId]: TypeId,
  ...spec,
  accepts: (v) =>
    spec.mechanismConfig.map((config) => ({
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
    })),
})

// TODO:
export const merge =
  <Mechanism_, T>(
    v: Record<string, Instrument.InstrumentBearer<Mechanism_, T>>,
  ): Instrument.Instrument<Mechanism_, T> =>
  (config) =>
    Array.flatMap(Record.values(v), (v) => v.accepts(config))
