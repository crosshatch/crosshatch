import { Types, Duration } from "effect"

import * as Proto from "../_Proto.ts"
import type * as Instrument from "../Instrument.ts"
import type { Address } from "./Address.ts"
import type * as Namespace from "./Namespace.ts"
import type * as Reference from "./Reference.ts"
import type * as TokenDeployment from "./TokenDeployment.ts"

const TypeId = Proto.id("TokenDeploymentGroup")

export interface TokenDeploymentGroupProps<Reference_ extends Reference.Any> {
  readonly amount: string

  readonly recipients: {
    readonly [K in Types.Tags<Reference_["namespace"]>]: Types.ExtractTag<
      Reference_["namespace"],
      K
    > extends infer Namespace_ extends Namespace.Any
      ?
          | {
              readonly [J in Extract<Reference_, { namespace: { _tag: K } }>["_tag"]]?:
                | (Address & Namespace.NamespaceBrand<Namespace_["_tag"]>)
                | undefined
            }
          | (Namespace_["address"]["uniform"] extends true
              ? Address & Namespace.NamespaceBrand<Namespace_["_tag"]>
              : never)
      : never
  }

  readonly ttl?: Duration.Input | undefined
}

export interface TokenDeploymentGroup<Reference_ extends Reference.Any, Mechanism_> extends Instrument.Instrument<
  Mechanism_,
  TokenDeploymentGroupProps<Reference_>
> {
  readonly [TypeId]: typeof TypeId

  readonly groups: ReadonlyArray<Reference_>
}

export declare const make: <L extends Record<string, TokenDeployment.Any>>(
  _record: L,
) => TokenDeploymentGroup<
  L[keyof L]["reference"],
  { readonly [K in keyof L]: TokenDeployment.Mechanism<L[K]> }[keyof L]
>
