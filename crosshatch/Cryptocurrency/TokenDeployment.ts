import { Duration, Effect } from "effect"

import * as Proto from "../_Proto.ts"
import type { Instrument, MechanismConfig } from "../index.ts"
import type * as Namespace from "./Namespace.ts"
import type * as Reference from "./Reference.ts"
import type * as Token from "./Token.ts"

const TypeId = Proto.id("TokenDeployment")

export interface TokenDeploymentSpec<
  Namespace_ extends Namespace.Any,
  Reference_ extends string,
  Token_ extends Token.Any,
  MechanismConfigs_ extends ReadonlyArray<MechanismConfig.Any>,
  GDE,
  GDR,
> {
  readonly reference: Reference.Reference<Namespace_, Reference_>

  readonly token: Token_

  readonly address: string

  readonly mechanismConfig: MechanismConfigs_

  readonly decimals: Effect.Effect<number, GDE, GDR>
}

export interface TokenDeploymentProps<Recipients> {
  readonly amount: string

  readonly recipients: Recipients

  readonly timeout?: Duration.Input | undefined
}

export interface TokenDeployment<
  Namespace_ extends Namespace.Any,
  Reference_ extends string,
  Token_ extends Token.Any,
  Mechanism_,
  GDE,
  GDR,
> extends Instrument.InstrumentBearer<
  Mechanism_,
  TokenDeploymentProps<{
    readonly [K in Namespace_["_tag"]]: Namespace_["Address"]["Type"]
  }>,
  GDE,
  GDR
> {
  readonly [TypeId]: typeof TypeId

  readonly reference: Reference.Reference<Namespace_, Reference_>

  readonly token: Token_

  readonly address: string

  readonly mechanismConfig: ReadonlyArray<MechanismConfig.Any>
}

export type Any = TokenDeployment<any, string, Token.Any, any, any, any>

export type Mechanism<T extends Any> =
  T extends TokenDeployment<any, string, Token.Any, infer Mechanism_, any, any> ? Mechanism_ : never

export const make = <
  Namespace_ extends Namespace.Any,
  Reference_ extends string,
  Token_ extends Token.Any,
  MechanismConfigs_ extends ReadonlyArray<MechanismConfig.Any>,
  GDE,
  GDR,
>(
  spec: TokenDeploymentSpec<Namespace_, Reference_, Token_, MechanismConfigs_, GDE, GDR>,
): TokenDeployment<
  Namespace_,
  Reference_,
  Token_,
  MechanismConfigs_[number] extends MechanismConfig.MechanismConfig<infer Mechanism_>
    ? Mechanism_["Identifier"]
    : never,
  GDE,
  GDR
> => ({
  [TypeId]: TypeId,
  ...spec,
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
})
