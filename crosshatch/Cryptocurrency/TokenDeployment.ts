import { Duration } from "effect"

import * as Proto from "../_Proto.ts"
import type { Instrument, MechanismConfig } from "../index.ts"
import type { Address } from "./Address.ts"
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

export interface TokenDeployment<
  Namespace_ extends Namespace.Any,
  Mechanism_,
  Reference_ extends string,
  Token_ extends Token.Any,
> extends Instrument.InstrumentBearer<
  Mechanism_,
  {
    readonly amount: string
    readonly recipient: Address
    readonly timeout?: Duration.Input | undefined
  }
> {
  readonly mechanism: Mechanism_

  readonly [TypeId]: typeof TypeId

  readonly reference: Reference.Reference<Namespace_, Reference_>

  readonly token: Token_

  readonly address: string

  readonly mechanismConfig: ReadonlyArray<MechanismConfig.Any>
}

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
  mechanism: null!,
  instrument: (v) =>
    spec.mechanismConfig.map((config) => ({
      scheme: "exact",
      network: {
        family: spec.reference.namespace._tag as never,
        reference: spec.reference._tag as never,
      },
      asset: spec.address,
      amount: v.amount,
      payTo: v.recipient,
      maxTimeoutSeconds: v.timeout ? Duration.toSeconds(v.timeout) : 0,
      ...(config.extra ? { extra: config.extra } : {}),
    })),
})
